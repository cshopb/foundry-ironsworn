<template>
  <article
    class="item-row document ironsworn__asset"
    draggable="true"
    :data-pack="foundryItem().pack"
    :data-id="foundryItem().id"
    :data-document-id="foundryItem().id"
    :class="{ [`asset-${toolset}`]: true }"
    @dragstart="dragStart"
    @dragend="dragEnd"
  >
    <header class="asset-header nogrow flexrow">
      <i class="fa-solid fa-grip nogrow block draggable item"></i>

      <button
        type="button"
        @click="state.expanded = !state.expanded"
        :aria-controls="bodyId"
        class="clickable text asset-expand-toggle"
      >
        <h4 class="asset-title">
          {{ foundryItem().name }}
        </h4>
      </button>
    </header>

    <CollapseTransition>
      <section
        v-if="state.expanded"
        class="asset-body flexcol"
        :aria-expanded="state.expanded"
        :id="bodyId"
      >
        <div
          v-html="$enrichHtml(system.description ?? '')"
          v-if="system.description"
        ></div>
        <div v-html="$enrichHtml(system.requirement ?? '')"></div>
        <dl class="asset-fields" v-if="system.fields?.length">
          <div
            class="asset-field"
            v-for="(field, i) in system.fields"
            :key="'field' + i"
          >
            <dt class="asset-field-label">{{ field.name }}</dt>
            <dd class="asset-field-value">{{ field.value }}</dd>
          </div>
        </dl>
        <ul class="asset-abilities flexcol">
          <WithRolllisteners
            v-for="(ability, i) in system.abilities"
            :key="'ability' + i"
            element="li"
            :class="{
              'asset-ability': true,
              [`bullet-${toolset}`]: true,
              marked: ability.enabled,
            }"
            @moveclick="moveClick"
          >
            <div
              class="asset-ability-text flexcol"
              v-html="$enrichHtml(ability.description)"
            ></div>
            <clock
              v-if="ability.hasClock"
              class="asset-ability-clock"
              :wedges="ability.clockMax"
              :ticked="ability.clockTicks"
            />
          </WithRolllisteners>
        </ul>
        <AttrSlider
          v-if="system.track.enabled"
          attr="track"
          documentType="Item"
          sliderStyle="horizontal"
          :max="system.track.max"
          :currentValue="system.track.current"
          :read-only="true"
        >
          <template #label>
            <label>{{ system.track.name }}</label>
          </template>
        </AttrSlider>
      </section>
    </CollapseTransition>
  </article>
</template>

<style lang="less" scoped>
.ironsworn .ironsworn__asset {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  margin: 10px 0;
  padding: 5px;
  --ironsworn-color-thematic: v-bind('system.color');
}
</style>

<script setup lang="ts">
import { IAsset } from 'dataforged'
import { computed, inject, provide, reactive } from 'vue'
import { IronswornItem } from '../../../item/item'
import { AssetDataPropertiesData } from '../../../item/itemtypes'
import { $ItemKey, ItemKey } from '../../provisions.js'

import Clock from '../clock.vue'
import WithRolllisteners from '../with-rolllisteners.vue'
import CollapseTransition from '../transition/collapse-transition.vue'
import AttrSlider from '../resource-meter/attr-slider.vue'

const props = defineProps<{
  df?: IAsset
  foundryItem: () => IronswornItem
}>()

const toolset = inject('toolset')
const system = (props.foundryItem() as any).system as AssetDataPropertiesData

provide($ItemKey, props.foundryItem())
provide(
  ItemKey,
  computed(() => props.foundryItem().toObject() as any)
)

const state = reactive({
  expanded: false,
})

const bodyId = `asset-body-${props.foundryItem().id}`

function moveClick(item) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', item.id)
}

function dragStart(ev) {
  ev.dataTransfer.setData(
    'text/plain',
    JSON.stringify({
      type: 'AssetBrowserData',
      pack: props.foundryItem().pack || undefined,
      id: props.foundryItem().id,
      uuid: props.foundryItem().uuid,
    })
  )

  CONFIG.IRONSWORN.emitter.emit('dragStart', props.foundryItem().type)
}

function dragEnd() {
  CONFIG.IRONSWORN.emitter.emit('dragEnd', props.foundryItem().type)
}
</script>
