<template>
  <UInput :modelValue="value" :disabled="disabled" size="xl" color="white" @keydown.enter="$emit('submit')"
    @update:modelValue="value = $event"
    :ui="{ wrapper: 'inline-block', base: 'size-16 select-none disabled:opacity-100 text-center', padding: { xl: 'p-0.5' }, size: { xl: 'text-[1em]' }, color: { white: { outline: (disabled ? 'ring-0' : 'ring-2') + ' ' + outline + ' ' + 'focus:ring-0 dark:focus:ring-0' } } }" />
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