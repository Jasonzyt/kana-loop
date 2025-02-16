<template>
  <UInput :modelValue="value" :disabled="disabled" size="xl" color="white" @keydown.enter="$emit('submit')"
    @update:modelValue="value = $event"
    :ui="{ wrapper: 'inline-block', base: 'size-16 select-none disabled:opacity-100 text-center', padding: { xl: 'p-0.5' }, size: { xl: 'text-[1em]' }, color: { white: { outline: (disabled ? 'focus:ring-1 dark:focus:ring-gray-700' : 'ring-2 focus:ring-2') + ' ' + outline + ' ' + 'dark:' + outline } } }" />
</template>

<script lang="ts" setup>
defineProps({
  disabled: {
    type: Boolean
  },
  fontSize: {
    type: String,
    default: '20px'
  },
  outline: {
    type: String,
    default: ""
  }
})
defineEmits(['submit'])
const value = defineModel<string>()
</script>

<style></style>