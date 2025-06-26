<template>
  <div>
    <h2 class="text-2xl text-gray-900 dark:text-gray-100 font-bold">Results</h2>
    <p class="text-gray-800 dark:text-gray-100">Accuracy: <span :class="color" class="text-[40px]">{{ accuracy
        }}%</span></p>
    <p class="text-gray-800 dark:text-gray-100">Time Elapsed: <span class="text-[30px] text-sky-500">{{
      stringifyDuration(Date.now() -
        config.startTime) }}</span></p>
  </div>
</template>

<script lang="ts" setup>
const config = useMyConfigStore()
const accuracy = Math.floor((config.currentCount - config.mistakeCount) / config.currentCount * 100)
const color = accuracy >= 50 ? 'text-green-500' : 'text-red-500'
</script>

<style></style>