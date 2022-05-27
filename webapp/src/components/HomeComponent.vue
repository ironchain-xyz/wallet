<template>
  <div class="home">
    <Navigation />
    <div class="content">
      <Facts v-if="authenticated"></Facts>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navigation from '@/components/NavigationComponent.vue'
import Facts from '@/components/FactsComponent.vue'
import { useStore } from '../store';
import { authenticate } from '../services/auth';

export default defineComponent({
  components: { Navigation, Facts },
  setup() {
    const store = useStore();
    const authenticated = ref<boolean>(false);

    if (!authenticate(store)) {
      return;
    } else {
      authenticated.value = true;
    }

    return {authenticated};
  },
})
</script>
