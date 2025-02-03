<template>
  <UModal v-model="open">
    <UCard
      :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: { padding: 'px-4 py-2.5 sm:py-3.5 sm:pl-6 sm:pr-5' }, body: { base: 'overflow-y-scroll scrollbar' } }">
      <template #header>
        <div class="flex font-bold items-center">
          <h1 class="grow text-xl">Settings</h1>
          <UButton color="gray" variant="ghost" icon="i-ic-round-close" @click="open = false" />
        </div>
      </template>
      <UForm :state="state" class="grid gap-2">
        <UFormGroup name="enableSeion" label="Show Voiceless (清音, e.g. ka,sa,etc...)"
          :ui="{ wrapper: 'flex', inner: 'grow', container: 'm-0' }">
          <UToggle v-model="state.enableSeion" />
        </UFormGroup>
        <UFormGroup name="enableDakuon" label="Show Voiced (浊音, e.g. ga,za,etc...)"
          :ui="{ wrapper: 'flex', inner: 'grow', container: 'm-0' }">
          <UToggle v-model="state.enableDakuon" />
        </UFormGroup>
        <UFormGroup name="enableYouon" label="Show Yōon (拗音, e.g. kya,sha,etc...)"
          :ui="{ wrapper: 'flex', inner: 'grow', container: 'm-0' }">
          <UToggle v-model="state.enableYouon" />
        </UFormGroup>
        <UFormGroup name="enableRomaji" label="Show Romanized Hints (Romaji)"
          :ui="{ wrapper: 'flex', inner: 'grow', container: 'm-0' }">
          <UToggle v-model="state.enableRomaji" />
        </UFormGroup>
        <UFormGroup name="blankHira" label="Make Hiragana (平假名) Blank"
          :ui="{ wrapper: 'flex', inner: 'grow', container: 'm-0' }">
          <UToggle v-model="state.blankHira" />
        </UFormGroup>
        <UFormGroup name="blankKana" label="Make Katakana (片假名) Blank"
          :ui="{ wrapper: 'flex', inner: 'grow', container: 'm-0' }">
          <UToggle v-model="state.blankKana" />
        </UFormGroup>
        <UFormGroup name="totalCount" label="Questions per Round (0 for endless)">
          <UInput v-model="state.totalCount" type="number" class="mt-2"
            @update:model-value="state._currentCountRef = state.totalCount" />
        </UFormGroup>
        <UFormGroup name="fonts" label="Use Custom Fonts">
          <UInput v-model="state.fonts" class="mt-2" @update:model-value="state._currentCountRef = state.totalCount" />
        </UFormGroup>
        <UFormGroup name="_" label="Clear Mistake History"
          help="To enhance memorization, we will increase the probability of occurrence of the questions you got wrong">
          <UButton color="red" @click="state.weights = {}">Clear</UButton>
        </UFormGroup>
      </UForm>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const open = defineModel<boolean>()
const state = reactive(GLOBAL_CONFIG)
setInterval(() => {
  if (open) {
    saveConfig()
  }
}, 1000)
</script>

<style>
.scrollbar::-webkit-scrollbar {
  width: 6px;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 3px;
}

.scrollbar::-webkit-scrollbar-track {
  background-color: #eee;
}
</style>