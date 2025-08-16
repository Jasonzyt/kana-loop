<template>
  <div class="flex flex-col px-6 py-2 sm:px-16 max-w-3xl h-[98vh]" style="margin: 0 auto">
    <div>
      <div class="flex py-6 sm:py-6 items-center">
        <div class="text-center py-4">
          <h1 class="text-green-500">Pass</h1>
          <p>{{ config.currentCount - config.mistakeCount }}</p>
        </div>
        <div class="grow px-4">
          <UProgress :min="0" :max="config.totalCount" :value="config.currentCount">
            <template #indicator>
              <div v-if="config.totalCount > 0" class="text-center">
                {{ config.currentCount }} / {{ config.totalCount }}
              </div>
              <div v-else class="text-center">
                ∞
              </div>
            </template>
          </UProgress>
          <p class="text-center text-gray-500 text-sm mt-2">{{ stringifyDuration(duration) }}</p>
        </div>
        <div class="text-center py-4">
          <h1 class="text-red-500">Fail</h1>
          <p>{{ config.mistakeCount }}</p>
        </div>
      </div>
      <div v-if="!showResult">
        <div class="pt-8 sm:pt-16 text-center">
          <Blank v-if="config.enableRomaji" v-model="blank.fill.romaji" disabled class="mr-4"
            :class="blank.fill.romaji.length > 2 ? 'text-[24px] ' : 'text-[30px] '" />
          <Blank v-model="blank.fill.hira" :disabled="blank.blank !== 'hira'"
            :outline="blank.blank === 'hira' ? outline : ''" class="text-[30px]" @submit="onSubmit" />
          <Blank v-model="blank.fill.kana" :disabled="blank.blank !== 'kana'"
            :outline="blank.blank === 'kana' ? outline : ''" class="text-[30px] ml-4" @submit="onSubmit" />
        </div>
        <div class="flex justify-center items-center py-24 sm:mt-16">
          <OptionGroup :options="options" @choose="onChoose"></OptionGroup>
        </div>
      </div>
      <div v-else class="text-center mt-6 sm:mt-10">
        <Result />
        <UButton color="gray" variant="solid" size="xl" icon="i-ic-baseline-restart-alt" label="Restart" class="mt-12"
          @click="restart" />
      </div>
    </div>
    <div class="grow" />
    <div class="w-full flex">
      <UPopover mode="hover">
        <UButton color="gray" variant="ghost" size="xl" icon="i-uil-cog" @click="settingsOpen = true" />
        <template #panel>
          <div class="py-2 px-3 text-gray-700 dark:text-gray-300">
            Settings
          </div>
        </template>
      </UPopover>
      <UPopover mode="hover">
        <UButton color="gray" variant="ghost" size="xl" icon="i-ic-baseline-restart-alt" @click="restart" />
        <template #panel>
          <div class="py-2 px-3 text-gray-700 dark:text-gray-300">
            Restart
          </div>
        </template>
      </UPopover>
      <div class="grow" />
      <UPopover mode="hover">
        <UButton color="gray" variant="ghost" size="xl" icon="i-uil-github" @click="window.location.href = 'https://github.com/Jasonzyt/kana-loop'" />
        <template #panel>
          <div class="py-2 px-3 text-gray-700 dark:text-gray-300">
            GitHub
          </div>
        </template>
      </UPopover>
      <UPopover mode="hover">
        <UButton color="gray" variant="ghost" size="xl" icon="i-uil-info-circle" @click="infoOpen = true" />
        <template #panel>
          <div class="py-2 px-3 text-gray-700 dark:text-gray-300">
            Info
          </div>
        </template>
      </UPopover>
    </div>
  </div>
  <Settings v-model="settingsOpen" />
  <Info v-model="infoOpen" />
</template>

<script lang="ts" setup>
const config = useMyConfigStore()

const settingsOpen = ref(false)
const infoOpen = ref(false)
const showResult = ref(false)

if (config.currentCount === config.totalCount && config.totalCount !== 0) {
  showResult.value = true
}

const blank = ref(generateBlank());
const options = ref<string[]>();
const outline = ref('ring-sky-500')
let submitted = false;

const nextQuestion = () => {
  outline.value = "ring-sky-500"
  blank.value = generateBlank()
  options.value = generateOptions(blank.value.answer, blank.value.blank)
  submitted = false
}
const finishRound = () => {
  config.started = false
  showResult.value = true
}
const restart = () => {
  showResult.value = false
  config.started = false;
  duration.value = 0;
  config.currentCount = 0;
  config.mistakeCount = 0;
  nextQuestion()
}
onMounted(nextQuestion)

const onChoose = (v: string) => {
  if (submitted) return
  (blank.value.fill as { [key: string]: string })[blank.value.blank] = v
  setTimeout(onSubmit, 1000)
}
const onSubmit = () => {
  if (submitted) return
  let filled = (blank.value.fill as { [key: string]: string })[blank.value.blank]
  let answer = (blank.value.answer as { [key: string]: string })[blank.value.blank]
  if (filled === '') {
    outline.value = "ring-red-500"
    setTimeout(() => outline.value = "ring-sky-500", 2000)
    return
  }
  config.currentCount++
  submitted = true
  if (!config.started) {
    config.startTime = Date.now()
    config.started = true
  }
  if (answer !== filled) {
    config.mistakeCount++
    if (config.weights[blank.value.answer.hira] === undefined) {
      config.weights[blank.value.answer.hira] = 1
    } else {
      config.weights[blank.value.answer.hira]++
    }
    blank.value.fill = blank.value.answer
    outline.value = "ring-red-500"
    if (config.currentCount === config.totalCount) {
      setTimeout(finishRound, config.wrongWaitingTime)
    } else {
      setTimeout(nextQuestion, config.wrongWaitingTime)
    }
  } else {
    if (config.weights[blank.value.answer.hira]) {
      config.weights[blank.value.answer.hira]--
      if (config.weights[blank.value.answer.hira] === 0) {
        delete config.weights[blank.value.answer.hira]
      }
    }
    outline.value = "ring-green-500"
    if (config.currentCount === config.totalCount) {
      setTimeout(finishRound, config.correctWaitingTime)
    } else {
      setTimeout(nextQuestion, config.correctWaitingTime)
    }
  }
}

const duration = ref(0)
setInterval(() => {
  if (config.started) {
    duration.value = Date.now() - config.startTime
  }
}, 1000)
</script>

<style>
body {
  font-family: v-bind('config.fonts'), 'Noto Sans JP', sans-serif;
}
</style>
