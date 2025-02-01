<template>
  <div class="px-4 sm:px-16">
    <div>
      <Settings :open="false"></Settings>
    </div>
    <div class="flex py-6 sm:py-6 items-center">
      <div class="text-center py-4">
        <h1 class="text-green-500">Pass</h1>
        <p>{{ GLOBAL_CONFIG.currentCount - GLOBAL_CONFIG.mistakeCount }}</p>
      </div>
      <div class="grow px-4">
        <UMeterGroup :min="0" :max="max" :indicator="GLOBAL_CONFIG.totalCount > 0" :ui="{ list: 'hidden' }">
          <UMeter :value="GLOBAL_CONFIG.currentCount - GLOBAL_CONFIG.mistakeCount" color="sky" />
          <UMeter :value="GLOBAL_CONFIG.mistakeCount" color="red" />
          <template #indicator>
            <div v-if="GLOBAL_CONFIG.totalCount > 0">
              {{ GLOBAL_CONFIG.currentCount }} / {{ GLOBAL_CONFIG.totalCount }}
            </div>
            <div v-else class="text-center">
              ∞
            </div>
          </template>
        </UMeterGroup>
        <p class="text-center text-gray-500 text-sm mt-2">{{ stringifyDuration(duration) }}</p>
      </div>
      <div class="text-center py-4">
        <h1 class="text-red-500">Fail</h1>
        <p>{{ GLOBAL_CONFIG.mistakeCount }}</p>
      </div>
    </div>
    <div class="pt-8 sm:pt-16 text-center">
      <Blank v-if="GLOBAL_CONFIG.enableRomaji" v-model="blank.fill.romaji" disabled :outline="outline" class="mr-4" :class="blank.fill.romaji.length > 2 ? 'text-[24px] ' : 'text-[30px] '" />
      <Blank v-model="blank.fill.hira" :disabled="blank.blank !== 'hira'" :outline="outline" class="text-[30px]" @submit="onSubmit" />
      <Blank v-model="blank.fill.kana" :disabled="blank.blank !== 'kana'" :outline="outline" class="text-[30px] ml-4" @submit="onSubmit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const max = GLOBAL_CONFIG.totalCount > 0 ? ref(GLOBAL_CONFIG.totalCount) : ref(GLOBAL_CONFIG.currentCount)
if (max.value === 0) {
  max.value = 1
}

const blank = reactive(generateBlank());
const outline = ref('focus:ring-sky-500')
const onSubmit = () => {
  let filled = (blank.fill as {[key: string]: string})[blank.blank]
  let answer = (blank.answer as {[key: string]: string})[blank.blank]
  if (filled === '') {
    outline.value = "focus:ring-red-500"
    return
  }
  GLOBAL_CONFIG.currentCount++
  if (!GLOBAL_CONFIG.started) {
    GLOBAL_CONFIG.startTime=Date.now()
    GLOBAL_CONFIG.started = true
  }
  if (answer !== filled) {
    GLOBAL_CONFIG.mistakeCount++
    if (GLOBAL_CONFIG.weights[blank.answer.hira]) {
      GLOBAL_CONFIG.weights[blank.answer.hira]++
    } else {
      GLOBAL_CONFIG.weights[blank.answer.hira] = 1
    }
  } else {
    if (GLOBAL_CONFIG.weights[blank.answer.hira]) {
      GLOBAL_CONFIG.weights[blank.answer.hira]--
      if (GLOBAL_CONFIG.weights[blank.answer.hira] === 0) {
        delete GLOBAL_CONFIG.weights[blank.answer.hira]
      }
    }
  }
  saveConfig()
}

const duration = ref(0)
setInterval(() => {
  if (GLOBAL_CONFIG.started) {
    duration.value = Date.now() - GLOBAL_CONFIG.startTime
  }
}, 1000)
</script>

<style></style>