<template>
  <TabSet
    :id="`${(actor as any)._id}_move-sheet`"
    ref="$tabSet"
    :class="$style.tabSet"
    :tabKeys="['moves', 'oracles']"
  >
    <TabList>
      <Tab :is="BtnIsicon" icon="d10-tilt" tab-key="moves">{{
        $t('IRONSWORN.Moves')
      }}</Tab>
      <Tab :is="BtnIsicon" icon="oracle" tab-key="oracles">{{
        $t('IRONSWORN.Oracles')
      }}</Tab>
    </TabList>
    <TabPanels>
      <TabPanel tab-key="moves" class="flexcol">
        <Suspense>
          <SfMovesheetmoves
            :class="$style.panelContent"
            ref="movesTab"
            :toolset="toolset"
          />
        </Suspense>
      </TabPanel>
      <TabPanel tab-key="oracles" class="flexcol">
        <Suspense>
          <SfMovesheetoracles
            :class="$style.panelContent"
            ref="oraclesTab"
            :toolset="toolset"
          />
        </Suspense>
      </TabPanel>
    </TabPanels>
  </TabSet>
</template>

<style lang="less" module>
.tabSet {
}
.panelContent {
  flex-grow: 1;
  // HACK: offsets the padding on window.content with a negative margin, then pads it out. this way, the scrollbar appears in the empty space left by the padding instead of overlapping the content.
  margin: 0 calc(var(--ironsworn-spacer-md) * -1);
  padding: 0 var(--ironsworn-spacer-md);
}
</style>

<script lang="ts" setup>
import SfMovesheetmoves from './components/sf-movesheetmoves.vue'
import SfMovesheetoracles from './components/sf-movesheetoracles.vue'
import { computed, provide, ref } from 'vue'
import { CharacterDataProperties } from '../actor/actortypes'
import { ActorKey } from './provisions.js'
import TabSet from './components/tabs/tab-set.vue'
import TabList from './components/tabs/tab-list.vue'
import Tab from './components/tabs/tab.vue'
import TabPanels from './components/tabs/tab-panels.vue'
import TabPanel from './components/tabs/tab-panel.vue'
import BtnIsicon from './components/buttons/btn-isicon.vue'

const props = defineProps<{
  actor: CharacterDataProperties
  toolset: 'ironsworn' | 'starforged'
}>()

provide(ActorKey, computed(() => props.actor) as any)

const $tabSet = ref<InstanceType<typeof TabSet>>()
const movesTab = ref<InstanceType<typeof SfMovesheetmoves>>()
CONFIG.IRONSWORN.emitter.on('highlightMove', () =>
  $tabSet.value?.setActiveTab('moves')
)

const oraclesTab = ref<InstanceType<typeof SfMovesheetoracles>>()
CONFIG.IRONSWORN.emitter.on('highlightOracle', () =>
  $tabSet.value?.setActiveTab('oracles')
)
</script>
