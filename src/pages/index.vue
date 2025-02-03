<template>
  <div class="px-6 py-2 sm:px-16 max-w-4xl" style="margin: 0 auto">
    <div>
      <Settings :open="false"></Settings>
    </div>
    <div class="flex py-6 sm:py-6 items-center">
      <div class="text-center py-4">
        <h1 class="text-green-500">Pass</h1>
        <p>{{ GLOBAL_CONFIG.currentCount - GLOBAL_CONFIG.mistakeCount }}</p>
      </div>
      <div class="grow px-4">
        <UMeterGroup :min="0" :max="max" :ui="{ list: 'hidden' }">
          <template #indicator>
            <div v-if="GLOBAL_CONFIG.totalCount > 0" class="text-center">
              {{ GLOBAL_CONFIG.currentCount }} / {{ GLOBAL_CONFIG.totalCount }}
            </div>
            <div v-else class="text-center">
              ∞
            </div>
          </template>
          <UMeter :value="GLOBAL_CONFIG.currentCount - GLOBAL_CONFIG.mistakeCount" color="sky" />
          <UMeter :value="GLOBAL_CONFIG.mistakeCount" color="red" />
        </UMeterGroup>
        <p class="text-center text-gray-500 text-sm mt-2">{{ stringifyDuration(duration) }}</p>
      </div>
      <div class="text-center py-4">
        <h1 class="text-red-500">Fail</h1>
        <p>{{ GLOBAL_CONFIG.mistakeCount }}</p>
      </div>
    </div>
    <div class="pt-8 sm:pt-16 text-center">
      <Blank v-if="GLOBAL_CONFIG.enableRomaji" v-model="blank.fill.romaji" disabled :outline="outline" class="mr-4"
        :class="blank.fill.romaji.length > 2 ? 'text-[24px] ' : 'text-[30px] '" />
      <Blank v-model="blank.fill.hira" ref="hiraBlank" :disabled="blank.blank !== 'hira'" :outline="outline"
        class="text-[30px]" @submit="onSubmit" />
      <Blank v-model="blank.fill.kana" ref="kanaBlank" :disabled="blank.blank !== 'kana'" :outline="outline"
        class="text-[30px] ml-4" @submit="onSubmit" />
    </div>
    <div class="flex justify-center items-center py-24">
      <OptionGroup :options="options" @choose="onChoose"></OptionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
const max = GLOBAL_CONFIG.totalCount > 0 ? ref(GLOBAL_CONFIG.totalCount) : ref(GLOBAL_CONFIG.currentCount)
if (max.value === 0) {
  max.value = 1
}

const blank = ref(generateBlank());
const options = ref<string[]>();
const hiraBlankRef = useTemplateRef('hiraBlank')
const kanaBlankRef = useTemplateRef('kanaBlank')
const outline = ref('focus:ring-sky-500')

const nextQuestion = () => {
  outline.value = "focus:ring-sky-500"
  blank.value = generateBlank()
  if (blank.value.blank === 'hira') {
    hiraBlankRef.value?.$el.children[0].focus()
  } else {
    kanaBlankRef.value?.$el.children[0].focus()
  }
  options.value = generateOptions(blank.value.answer, blank.value.blank)
}
onMounted(nextQuestion)

const onChoose = (v: string) => {
  (blank.value.fill as { [key: string]: string })[blank.value.blank] = v
  if (blank.value.blank === 'hira') {
    hiraBlankRef.value?.$el.children[0].focus()
  } else {
    kanaBlankRef.value?.$el.children[0].focus()
  }
  setTimeout(onSubmit, 1000)
}
const onSubmit = () => {
  let filled = (blank.value.fill as { [key: string]: string })[blank.value.blank]
  let answer = (blank.value.answer as { [key: string]: string })[blank.value.blank]
  if (filled === '') {
    outline.value = "focus:ring-red-500"
    setTimeout(() => outline.value = "focus:ring-sky-500", 2000)
    return
  }
  GLOBAL_CONFIG.currentCount++
  if (!GLOBAL_CONFIG.started) {
    GLOBAL_CONFIG.startTime = Date.now()
    GLOBAL_CONFIG.started = true
  }
  if (answer !== filled) {
    GLOBAL_CONFIG.mistakeCount++
    if (GLOBAL_CONFIG.weights[blank.value.answer.hira]) {
      GLOBAL_CONFIG.weights[blank.value.answer.hira]++
    } else {
      GLOBAL_CONFIG.weights[blank.value.answer.hira] = 1
    }
    blank.value.fill = blank.value.answer
    outline.value = "focus:ring-red-500"
    setTimeout(nextQuestion, 2000)
  } else {
    if (GLOBAL_CONFIG.weights[blank.value.answer.hira]) {
      GLOBAL_CONFIG.weights[blank.value.answer.hira]--
      if (GLOBAL_CONFIG.weights[blank.value.answer.hira] === 0) {
        delete GLOBAL_CONFIG.weights[blank.value.answer.hira]
      }
    }
    outline.value = "focus:ring-green-500"
    setTimeout(nextQuestion, 500)
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