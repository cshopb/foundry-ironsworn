<template>
  <btn-isicon
    @click="rollProgress()"
    :tooltip="$t('IRONSWORN.MakeAProgressRoll', { score: progressScore })"
    class="progress-roll"
    icon="d10-tilt"
    :disabled="props.disabled"
  >
    <slot name="default"></slot>
  </btn-isicon>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import { ProgressDataProperties } from '../../../item/itemtypes'
import { $ItemKey } from '../../provisions'
import BtnIsicon from './btn-isicon.vue'

const props = defineProps<{ item: any; tooltip?: string; disabled?: boolean }>()

const $item = inject($ItemKey, undefined)

const progressScore = computed(() => {
  return Math.floor(props.item.system.current / 4)
})

function rollProgress() {
  $item?.fulfill()
}
</script>
