<template>
  <AttrSlider
    class="momentum-meter"
    attr="momentum"
    documentType="Actor"
    :labelPosition="labelPosition"
    :sliderStyle="props.sliderStyle"
    :current-value="actorSys.momentum ?? 2"
    :min="-6"
    :max="10"
    :softMax="actorSys.momentumMax"
    :segmentClass="{
      [actorSys.momentumReset]: 'segment-momentum-reset',
    }"
  >
    <template #label>
      <BtnMomentumburn
        class="text"
        :class="{ 'vertical-text': sliderStyle === 'vertical' }"
        :tooltip="
          $t('IRONSWORN.BurnMomentumAndResetTo', {
            value: actorSys.momentum,
            resetValue: actorSys.momentumReset,
          })
        "
      >
        {{ $t('IRONSWORN.Momentum') }}
      </BtnMomentumburn>
    </template>
  </AttrSlider>
</template>

<style lang="less">
@import '../../../../styles/mixins.less';
.momentum-meter {
  gap: 5px 0;
  .attr-slider-label:hover ~ .slider-bar {
    .segment-momentum-reset {
      .blockHoverMixin();
      box-shadow: 0 0 5px var(--ironsworn-color-warm) inset,
        0 0 5px var(--ironsworn-color-warm),
        0 0 10px var(--ironsworn-color-cool);
    }
  }
}
</style>

<script lang="ts" setup>
import { computed, inject, Ref } from 'vue'
import { IronswornActor } from '../../../actor/actor.js'
import {
  CharacterDataProperties,
  CharacterDataPropertiesData,
} from '../../../actor/actortypes.js'
import { ActorKey } from '../../provisions.js'
import BtnMomentumburn from '../buttons/btn-momentumburn.vue'

import AttrSlider from './attr-slider.vue'

const props = withDefaults(
  defineProps<{
    sliderStyle?: 'horizontal' | 'vertical'
    labelPosition?: 'right' | 'left'
  }>(),
  { sliderStyle: 'vertical', labelPosition: 'left' }
)

const actor = inject(ActorKey) as Ref<
  ReturnType<typeof IronswornActor.prototype.toObject> & CharacterDataProperties
>
const actorSys = computed(
  () => (actor.value as any)?.system as CharacterDataPropertiesData
)
</script>
