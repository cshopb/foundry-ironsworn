<template>
  <div
    :class="classes"
    @click="click"
    :data-tooltip="$t('IRONSWORN.Roll +x', { stat: $t(i18nKey) })"
  >
    <h4>{{ $t(i18nKey) }}</h4>
    <div class="flexrow">
      <div class="clickable text" v-if="editMode" @click="decrement">
        &minus;
      </div>
      <h4>{{ actorSys[attr] }}</h4>
      <div class="clickable text" v-if="editMode" @click="increment">
        &plus;
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../../styles/mixins.less';
.stat {
  &:before {
    --ironsworn-color-bg-highlight: var(--ironsworn-color-fg);
  }
  & > * {
    position: relative; // must be set to manipulate z-index
    z-index: 1;
  }
  &:before {
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
    padding: 0.25em;
  }
  &:hover {
    &:before {
      opacity: 1;
    }
  }
}
</style>

<script lang="ts" setup>
import { inject, computed, capitalize, Ref } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { CharacterDataPropertiesData } from '../../actor/actortypes'
import { IronswornPrerollDialog } from '../../rolls'
import { $ActorKey, ActorKey } from '../provisions'

const props = defineProps<{ attr: string }>()
const $actor = inject($ActorKey)
const actor = inject(ActorKey) as Ref<
  ReturnType<typeof IronswornActor.prototype.toObject>
>
const actorSys = computed(
  () => (actor.value as any)?.system as CharacterDataPropertiesData
)

const classes = computed(() => ({
  stat: true,
  block: true,
  clickable: !editMode.value,
  'isiconbg-d10-tilt': !editMode.value,
}))
const i18nKey = computed(() => `IRONSWORN.${capitalize(props.attr)}`)
const editMode = computed(
  () => !!(actor.value.flags as any)['foundry-ironsworn']?.['edit-mode']
)

function click() {
  if (editMode.value) return

  let attrName = game.i18n.localize('IRONSWORN.' + capitalize(props.attr))
  if (attrName.startsWith('IRONSWORN.')) attrName = props.attr
  const name = `${attrName} (${$actor?.name})`
  IronswornPrerollDialog.showForStat(name, $actor?.system[props.attr], $actor)
}

function increment() {
  const value = parseInt(actorSys.value?.[props.attr]) + 1
  $actor?.update({ system: { [props.attr]: value } })
}
function decrement() {
  const value = parseInt(actorSys.value?.[props.attr]) - 1
  $actor?.update({ system: { [props.attr]: value } })
}
</script>
