<template>
  <div class="home">
    <Navigation />
    <div class="content">
      <Facts></Facts>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navigation from '@/components/NavigationComponent.vue'
import Facts from '@/components/FactsComponent.vue'

export default defineComponent({
  components: { Navigation, Facts },
  setup() {
    return {};
  },
})
</script>
