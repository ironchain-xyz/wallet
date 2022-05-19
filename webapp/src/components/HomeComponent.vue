<template>
  <div class="home">
    <Navigation />
    <div class="content">
      <Events></Events>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navigation from '@/components/NavigationComponent.vue'
import Events from '@/components/EventsComponent.vue'

export default defineComponent({
  components: {Navigation, Events},
  setup() {
    return {};
  },
})
</script>
