<template>
  <div>
    <div class="correctness-header" v-if="correctnessLog.length">
      <i
        v-for="(val, i) in correctnessLog"
        :key="`icon-for-item-${i}`"
        class="fas"
        :class="{
          'fa-question-circle': val === undefined,
          'fa-circle-check': val === true,
          'fa-minus-circle': val === false,
          'active-question-icon': val === undefined && i === currentQuestionIndex
        }"
      />
    </div>

    <h1>Count By {{ step }}</h1>

    <div class="problem-line">
      <template v-for="(item, index) in activeQuestion.items" :key="index">
        <NumberInput
          v-model="item.userInput"
          :locked="questionLocked || !item.missing"
          width="120px"
          :status="questionLocked && item.missing
                    ? (Number(item.userInput) === item.value ? 'correct-input' : 'incorrect-input')
                    : ''"
        />
        <span v-if="index !== activeQuestion.items.length - 1" class="comma">,</span>
      </template>
    </div>

    <button
      :class="buttonClass"
      @click="handleButtonClick"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import NumberInput from './components/NumberInput.vue'
import randomQuestion from './randomQuestion.js'

const DEFAULTS = {
  step: 6,
  min: 1,
  max: 100,
  sequenceLength: 6,
  missingCount: 3,
  numQuestions: 5
}

const step = ref()
const min = ref()
const max = ref()
const sequenceLength = ref()
const missingCount = ref()
const numQuestions = ref()
const currentQuestionIndex = ref(0)
const activeQuestion = ref()
const correctnessLog = ref([])

const questionLocked = ref(false)
const isCompleted = ref(false)

const buttonLabel = computed(() => {
  if (!questionLocked.value) return 'Submit'
  if (questionLocked.value && !isCompleted.value) return 'Next'
  return 'Reset'
})

const buttonClass = computed(() => {
  if (!questionLocked.value) return 'submit-btn'
  if (questionLocked.value && !isCompleted.value) return 'next-btn'
  return 'reset-btn'
})

function parseParam(params, key, defaultValue, minAllowed) {
  const val = params.get(key)
  if (val !== null) {
    const n = Number(val)
    if (Number.isFinite(n) && (minAllowed === undefined || n >= minAllowed)) {
      return n
    }
  }
  return defaultValue
}

function generateQuestion() {
  return randomQuestion(
    step.value,
    min.value,
    max.value,
    sequenceLength.value,
    missingCount.value
  )
}

function playCorrectSound() {
  const audio = new Audio('/correct.mp3')
  audio.volume = 0.5
  audio.play().catch(err => console.warn('Correct sound blocked:', err))
}

function playIncorrectSound() {
  const audio = new Audio('/incorrect.mp3')
  audio.volume = 0.5
  audio.play().catch(err => console.warn('Incorrect sound blocked:', err))
}

function resetAll() {
  correctnessLog.value = new Array(numQuestions.value).fill(undefined)
  currentQuestionIndex.value = 0
  activeQuestion.value = generateQuestion()
  questionLocked.value = false
  isCompleted.value = false
}

function nextQuestion() {
  currentQuestionIndex.value++
  if (currentQuestionIndex.value < numQuestions.value) {
    activeQuestion.value = generateQuestion()
    questionLocked.value = false
  } else {
    isCompleted.value = true
  }
}

function handleButtonClick() {
  if (!questionLocked.value) {
    questionLocked.value = true
    const allCorrect = activeQuestion.value.items.every(item => {
      return !item.missing || Number(item.userInput) === item.value
    })
    correctnessLog.value[currentQuestionIndex.value] = allCorrect

    if (allCorrect) {
      playCorrectSound()
    } else {
      playIncorrectSound()
    }

  } else if (!isCompleted.value) {
    nextQuestion()
  } else {
    resetAll()
  }
}

onBeforeMount(() => {
  const params = new URLSearchParams(window.location.search)
  step.value = parseParam(params, 'countBy', DEFAULTS.step, 1)
  min.value = parseParam(params, 'min', DEFAULTS.min)
  max.value = parseParam(params, 'max', DEFAULTS.max, min.value)
  sequenceLength.value = parseParam(params, 'sequenceLength', DEFAULTS.sequenceLength)
  missingCount.value = parseParam(params, 'missingCount', DEFAULTS.missingCount)
  numQuestions.value = parseParam(params, 'numQuestions', DEFAULTS.numQuestions)

  resetAll()
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.problem-line {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.correctness-header i {
  margin: 0 3px;
  font-size: 1.5rem;
}

.comma {
  padding: 0 10px 0 2px;
  font-size: 2rem;
}

.fa-circle-check { color: limegreen; }
.fa-minus-circle { color: orangered; }
.fa-question-circle { color: grey; }

button {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;
}

.submit-btn { background-color: #3498db; color: white; }
.submit-btn:hover { background-color: #2980b9; }

.next-btn { background-color: #f39c12; color: white; }
.next-btn:hover { background-color: #d35400; }

.reset-btn { background-color: #2ecc71; color: white; }
.reset-btn:hover { background-color: #27ae60; }

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.active-question-icon {
  font-size: 1.8rem;
  color: #1abc9c; /* teal */
  animation: pulse 1.2s infinite ease-in-out;
}
</style>
