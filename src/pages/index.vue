<template>
  <div class="flex flex-col px-6 py-2 sm:px-16 max-w-3xl h-[98vh]" style="margin: 0 auto">
    <div>
      <div class="flex py-6 sm:py-6 items-center">
        <div class="text-center py-4">
          <h1 class="text-green-500">Pass</h1>
          <p>{{ GLOBAL_CONFIG.currentCount - GLOBAL_CONFIG.mistakeCount }}</p>
        </div>
        <div class="grow px-4">
          <UProgress :min="0" :max="GLOBAL_CONFIG.totalCount" :value="GLOBAL_CONFIG.currentCount">
            <template #indicator>
              <div v-if="GLOBAL_CONFIG.totalCount > 0" class="text-center">
                {{ GLOBAL_CONFIG.currentCount }} / {{ GLOBAL_CONFIG.totalCount }}
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
          <p>{{ GLOBAL_CONFIG.mistakeCount }}</p>
        </div>
      </div>
      <div v-if="!showResult">
        <div class="pt-8 sm:pt-16 text-center">
          <Blank v-if="GLOBAL_CONFIG.enableRomaji" v-model="blank.fill.romaji" disabled :outline="outline" class="mr-4"
            :class="blank.fill.romaji.length > 2 ? 'text-[24px] ' : 'text-[30px] '" />
          <Blank v-model="blank.fill.hira" ref="hiraBlank" :disabled="blank.blank !== 'hira'" :outline="outline"
            class="text-[30px]" @submit="onSubmit" />
          <Blank v-model="blank.fill.kana" ref="kanaBlank" :disabled="blank.blank !== 'kana'" :outline="outline"
            class="text-[30px] ml-4" @submit="onSubmit" />
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
          <div class="py-2 px-3 text-gray-700">
            Settings
          </div>
        </template>
      </UPopover>
      <UPopover mode="hover">
        <UButton color="gray" variant="ghost" size="xl" icon="i-ic-baseline-restart-alt" @click="restart" />
        <template #panel>
          <div class="py-2 px-3 text-gray-700">
            Restart
          </div>
        </template>
      </UPopover>
      <div class="grow" />
      <UPopover mode="hover">
        <UButton color="gray" variant="ghost" size="xl" icon="i-uil-info-circle" @click="infoOpen = true" />
        <template #panel>
          <div class="py-2 px-3 text-gray-700">
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
loadConfig()

const settingsOpen = ref(false)
const infoOpen = ref(false)
const showResult = ref(false)

if (GLOBAL_CONFIG.currentCount === GLOBAL_CONFIG.totalCount) {
  showResult.value = true
}

const blank = ref(generateBlank());
const options = ref<string[]>();
const hiraBlankRef = useTemplateRef('hiraBlank')
const kanaBlankRef = useTemplateRef('kanaBlank')
const outline = ref('focus:ring-sky-500')
let submitted = false;

const nextQuestion = () => {
  outline.value = "focus:ring-sky-500"
  blank.value = generateBlank()
  options.value = generateOptions(blank.value.answer, blank.value.blank)
  // TODO: fix outline
  if (blank.value.blank === 'hira') {
    hiraBlankRef.value?.$el.children[0].focus()
  } else {
    kanaBlankRef.value?.$el.children[0].focus()
  }
  submitted = false
}
const finishRound = () => {
  GLOBAL_CONFIG.started = false
  showResult.value = true
}
const restart = () => {
  showResult.value = false
  GLOBAL_CONFIG.started = false;
  duration.value = 0;
  GLOBAL_CONFIG.currentCount = 0;
  GLOBAL_CONFIG.mistakeCount = 0;
  nextQuestion()
}
onMounted(nextQuestion)

const onChoose = (v: string) => {
  if (submitted) return
  (blank.value.fill as { [key: string]: string })[blank.value.blank] = v
  if (blank.value.blank === 'hira') {
    hiraBlankRef.value?.$el.children[0].focus()
  } else {
    kanaBlankRef.value?.$el.children[0].focus()
  }
  setTimeout(onSubmit, 1000)
}
const onSubmit = () => {
  if (submitted) return
  let filled = (blank.value.fill as { [key: string]: string })[blank.value.blank]
  let answer = (blank.value.answer as { [key: string]: string })[blank.value.blank]
  if (filled === '') {
    outline.value = "focus:ring-red-500"
    setTimeout(() => outline.value = "focus:ring-sky-500", 2000)
    return
  }
  GLOBAL_CONFIG.currentCount++
  submitted = true
  if (!GLOBAL_CONFIG.started) {
    GLOBAL_CONFIG.startTime = Date.now()
    GLOBAL_CONFIG.started = true
  }
  if (answer !== filled) {
    GLOBAL_CONFIG.mistakeCount++
    if (GLOBAL_CONFIG.weights[blank.value.answer.hira] === undefined) {
      GLOBAL_CONFIG.weights[blank.value.answer.hira] = 1
    } else {
      GLOBAL_CONFIG.weights[blank.value.answer.hira]++
    }
    blank.value.fill = blank.value.answer
    outline.value = "focus:ring-red-500"
    if (GLOBAL_CONFIG.currentCount === GLOBAL_CONFIG.totalCount) {
      setTimeout(finishRound, 500)
    } else {
      setTimeout(nextQuestion, 2000)
    }
  } else {
    if (GLOBAL_CONFIG.weights[blank.value.answer.hira]) {
      GLOBAL_CONFIG.weights[blank.value.answer.hira]--
      if (GLOBAL_CONFIG.weights[blank.value.answer.hira] === 0) {
        delete GLOBAL_CONFIG.weights[blank.value.answer.hira]
      }
    }
    outline.value = "focus:ring-green-500"
    if (GLOBAL_CONFIG.currentCount === GLOBAL_CONFIG.totalCount) {
      setTimeout(finishRound, 500)
    } else {
      setTimeout(nextQuestion, 500)
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

<style>
body {
  font-family: v-bind('GLOBAL_CONFIG.fonts'), 'Noto Sans JP', sans-serif;
}
</style>