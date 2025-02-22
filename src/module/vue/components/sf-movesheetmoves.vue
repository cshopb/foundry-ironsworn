<template>
  <article class="flexcol" :class="$style.wrapper">
    <nav class="flexrow nogrow" :class="$style.navSearch">
      <input
        type="search"
        :placeholder="$t('IRONSWORN.Search')"
        v-model="state.searchQuery"
        @keydown.enter.prevent
      />
      <BtnFaicon
        icon="times-circle"
        class="nogrow clickable text"
        @click="clearSearch()"
        :class="$style.searchBtn"
      />
      <BtnFaicon
        icon="compress-alt"
        class="nogrow clickable text"
        @click="collapseMoveCategories()"
        :class="$style.searchBtn"
      />
    </nav>

    <ul
      v-if="state.searchQuery"
      class="item-list scrollable flexcol"
      :class="$style.itemList"
    >
      <!-- Flat search results -->
      <li
        v-for="(move, resultIndex) of searchResults"
        :key="move.moveItem().id ?? `move${resultIndex}`"
        class="nogrow"
      >
        <SfMoverow
          :move="move"
          ref="allMoves"
          :thematicColor="move.color"
          :class="$style.filteredMoveRow"
        />
      </li>
    </ul>

    <ul v-else class="item-list scrollable flexcol" :class="$style.itemList">
      <!-- Categorized moves if not searching -->
      <li
        v-for="(category, catIndex) in state.categories"
        :key="catIndex"
        class="nogrow"
      >
        <SfMoveCategoryRows
          class="nogrow"
          :class="$style.categoryList"
          :category="category"
          ref="allCategories"
        />
      </li>
    </ul>
  </article>
</template>

<style lang="less" module>
.navSearch {
  margin-top: var(--ironsworn-spacer-lg);
}
.searchBtn {
  // padding: 6px;
  &:empty {
    // to override default icon-button styling
    height: var(--form-field-height);
    width: var(--form-field-height);
    padding: var(--ironsworn-spacer-md);
  }
  aspect-ratio: 1;
  flex: 0;
}
.wrapper {
  gap: var(--ironsworn-spacer-lg);
}
.itemList {
  scroll-behavior: smooth;
  scroll-snap-type: mandatory;
  scroll-snap-align: start;
  gap: var(--ironsworn-spacer-md);
  margin: 0;
}
.categoryList {
  // FIXME: for some reason, no matter where i set overflow, the focus outline on the list items is clipped. ideally, they shouldn't be!
  overflow-x: clip;
  overflow-clip-margin: 5px; // Dec 10, 2022: this would be better as 'padding-box', but major browsers only support length values at the moment.
  // details: https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-clip-margin
}
.filteredMoveRow {
  border-radius: var(--ironsworn-border-radius-lg);
}
</style>

<script setup lang="ts">
import { computed, nextTick, provide, reactive, ref } from 'vue'
import {
  createIronswornMoveTree,
  createStarforgedMoveTree,
  MoveCategory,
} from '../../features/custommoves'
import SfMoveCategoryRows from './sf-move-category-rows.vue'
import SfMoverow from './sf-moverow.vue'
import BtnFaicon from './buttons/btn-faicon.vue'

const props = defineProps<{ toolset: 'ironsworn' | 'starforged' }>()
provide('toolset', props.toolset)

const state = reactive({
  searchQuery: '',
  categories: [] as MoveCategory[],
})

let allCategories = ref<InstanceType<typeof SfMoveCategoryRows>[]>([])
let allMoves = ref<InstanceType<typeof SfMoverow>[]>([])

const tempCategories =
  props.toolset === 'ironsworn'
    ? await createIronswornMoveTree()
    : await createStarforgedMoveTree()

state.categories = tempCategories

const checkedSearchQuery = computed(() => {
  try {
    new RegExp(state.searchQuery)
    return state.searchQuery
  } catch (error) {
    return ''
  }
})

const flatMoves = computed(() =>
  state.categories.flatMap((category) =>
    category.moves.map((mv) => ({ ...mv, color: category.color }))
  )
)

const searchResults = computed(() => {
  if (!checkedSearchQuery.value) return null

  const re = new RegExp(checkedSearchQuery.value, 'i')
  return flatMoves.value.filter((x) => re.test(x.displayName))
})

function clearSearch() {
  state.searchQuery = ''
}

function collapseMoves() {
  for (const cat of allCategories.value ?? []) {
    cat.collapseMoves()
  }
}

function collapseMoveCategories() {
  for (const moveCategory of allCategories.value ?? []) {
    moveCategory.$collapsible?.collapse()
  }
}

CONFIG.IRONSWORN.emitter.on('highlightMove', async (targetMoveId) => {
  clearSearch()
  await nextTick()
  const categoryWithMove = allCategories.value.find((moveCategory) =>
    moveCategory.moveItems.has(targetMoveId)
  )
  if (categoryWithMove) {
    categoryWithMove.expandAndHighlightMove(targetMoveId)
  }
})
</script>
