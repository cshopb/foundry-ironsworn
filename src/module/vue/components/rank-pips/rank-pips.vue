<template>
  <article
    class="rank-pips"
    :aria-label="$t('IRONSWORN.ChallengeRank')"
    :aria-valuetext="current"
  >
    <button
      v-for="rank in ranks"
      :key="rank"
      @click="$emit('click', rank)"
      :data-tooltip="$t(`IRONSWORN.${$capitalize(rank)}`)"
      data-tooltip-direction="UP"
      type="button"
      class="rank-pip nogrow theme-pip"
      :aria-selected="rank === current"
    >
      <PipSvgCircle
        v-if="pipStyle === 'circle'"
        role="presentational"
        class="svg pip-shape"
      />
      <PipSvgHex
        v-if="pipStyle === 'hex'"
        role="presentational"
        class="svg pip-shape"
      />
    </button>
  </article>
</template>

<style lang="less">
.rank-pips {
  width: max-content;
  flex-grow: 0;
  .rank-pip {
    margin: 0;
    border: none;
    .pip-shape > * {
      stroke-width: var(--widget-stroke-width);
    }
  }
}
</style>
<style lang="less" scoped>
.rank-pips {
  // so that hover effects only happen when a pip is hovered
  pointer-events: none;
  display: flex;
  flex-flow: row nowrap;
  stroke: var(--ironsworn-color-fg);
  fill: var(--ironsworn-color-fg-80);
  fill-opacity: 1;
  align-content: center;
  gap: 2px;
  transition: var(--std-animation);
  &:hover {
    fill: var(--ironsworn-color-fg-40);
  }
  button.rank-pip {
    background-color: unset;
    pointer-events: all;
    display: flex;
    height: auto;
    padding: 0;
    line-height: 0;
    justify-items: center;
    align-items: center;
    transition-duration: 0s;
    .pip-shape {
      height: inherit;
      overflow: visible;
      width: 1em;
    }
    &:hover {
      box-shadow: unset;
      color: currentColor;
      ~ .rank-pip {
        fill-opacity: 0;
      }
    }
  }
  &:not(:hover) {
    button.rank-pip {
      &[aria-selected='true'] {
        ~ button.rank-pip {
          fill-opacity: 0;
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { RANKS } from '../../../constants'
import PipSvgHex from './pip-svg-hex.vue'
import PipSvgCircle from './pip-svg-circle.vue'
import { IronswornSettings } from '../../../helpers/settings.js'

const props = defineProps<{
  current: keyof typeof RANKS
}>()

const pipStyle = computed(() =>
  IronswornSettings.get('theme') === 'starforged' ? 'hex' : 'circle'
)

const ranks = Object.keys(RANKS)

defineEmits(['click'])
</script>
