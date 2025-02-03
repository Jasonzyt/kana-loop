<template>
  <div class="grid gap-4 max-w-80" :class="columnMap[options.length.toString()]">
    <Option v-for="opt in options" :value="opt as string" @click="(value) => { $emit('choose', value) }" />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  options: {
    type: Array,
    default: []
  }
})
defineEmits(['choose'])
const columnMap: Record<string, string> = {
  '4': 'grid-cols-4',
  '6': 'grid-cols-3',
  '8': 'grid-cols-4',
  '9': 'grid-cols-3',
  '12': 'grid-cols-4'
}
</script>