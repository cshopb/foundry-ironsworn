<template>
  <active-completed-progresses
    :excluded-subtypes="['bond']"
    :progress-stars="true"
  />
</template>

<script setup lang="ts">
import ActiveCompletedProgresses from '../active-completed-progresses.vue'
</script>
