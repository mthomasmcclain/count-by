<template>
  <input
    class="number-input"
    type="number"
    :value="modelValue"
    :disabled="locked"
    :style="{ width: width }"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  modelValue: {
    type: [Number, String],
    default: ''
  },
  width: {
    type: String,
    default: '80px'
  },
  locked: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.number-input {
  font-size: 2.5rem;
  text-align: center;
  padding: 0.4em;
  border: 3px solid #333;
  border-radius: 12px;
  outline: none;
}

.number-input:disabled {
  background: #f0f0f0;
  color: #777;
}

/* Remove Up and Down Arrow Chrome, Safari, Edge */
.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
.number-input[type="number"] {
  -moz-appearance: textfield;
}

</style>
