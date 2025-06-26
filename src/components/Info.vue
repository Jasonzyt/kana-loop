<template>
  <UModal v-model="open">
    <UCard
      :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: { padding: 'px-4 py-2.5 sm:py-3.5 sm:pl-6 sm:pr-5' } }">
      <template #header>
        <div class="flex font-bold items-center">
          <h1 class="grow text-xl">Info</h1>
          <UButton color="gray" variant="ghost" icon="i-ic-round-close" @click="open = false" />
        </div>
      </template>
      <h2 class="text-md font-bold text-gray-900 dark:text-gray-100 mb-2">Tip</h2>
      <p class="text-sm text-gray-800 dark:text-gray-200">For best results, make sure you have a basic understanding of the 50 kanas.
        You can write down the 50-kana table several times to achieve it.</p>
      <p class="text-sm text-gray-800 dark:text-gray-200">And you can modify the options in the settings to match your stage of learning.
      </p>
      <br />
      <p class="text-gray-800 dark:text-gray-100">By <NuxtLink to="https://jasonz.yt"
          class="text-sky-500 hover:text-sky-600">
          @Jasonzyt
        </NuxtLink>. Project at
        <NuxtLink to="https://github.com/Jasonzyt/kana-loop">
          <Icon name="uil:github" />
        </NuxtLink>.
        Star it if you like~
      </p>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const open = defineModel<boolean>()
</script>

<style></style>