<template>
  <div>
    <h1>Count By {{ step }}</h1>
    <div class="problem-line">
      <template
        v-for="n in 5"
        :key="`user-input-${n}`"
      >
        <NumberInput
          :modelValue="n * step"
          width="120px"
          locked
        />
        <span
          v-if="n !== 5"
          style="padding:0 10px 0 2px; font-size: 2rem;"
        >,</span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import NumberInput from './components/NumberInput.vue'
import randomQuestion from './randomQuestion.js'

const step = ref(undefined)
const min = ref(undefined)
const max = ref(undefined)
const length = ref(undefined)
const missingCount = ref(undefined)
const problem = ref(undefined)

const DEFAULT_STEP = 6
const DEFAULT_MIN = 1
const DEFAULT_MAX = 100
const DEFAULT_LENGTH = 6
const DEFAULT_MISSING_COUNT = 3


onBeforeMount(() => {
  const params = new URLSearchParams(window.location.search)

  const parseParam = (key, defaultValue, minAllowed) => {
    const val = params.get(key)
    if (val !== null) {
      const n = Number(val)
      if (Number.isFinite(n) && (minAllowed === undefined || n >= minAllowed)) {
        return n
      }
    }
    return defaultValue
  }

  step.value = parseParam('count', DEFAULT_STEP, 1)
  min.value  = parseParam('min', DEFAULT_MIN)
  max.value  = parseParam('max', DEFAULT_MAX, min.value)
  length.value = parseParam('length', DEFAULT_LENGTH)
  missingCount.value = parseParam('missingCount', DEFAULT_MISSING_COUNT)


  problem.value = randomQuestion(
      step.value,
      min.value,
      max.value,
      length.value,
      missingCount.value
    )
  console.log(problem.value)
})



</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.problem-line {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
