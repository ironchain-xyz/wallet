<template>
  <div class="home">
    <Navigation />
    <div class="content" v-if="authenticated">
      <a-row justify="center">
        <a-button type="primary" size="large" href="/fact/new">
            Create your fact
        </a-button>
      </a-row>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="created">
          <Facts mode="created"></Facts>
        </a-tab-pane>
        <a-tab-pane key="2" tab="collected">
          <Facts mode="collected"></Facts>
        </a-tab-pane>
      </a-tabs>
      
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
    const activeKey = ref<string>("1");

    if (!authenticate(store)) {
      return;
    } else {
      authenticated.value = true;
    }

    return {
      authenticated,
      activeKey,
    };
  },
})
</script>
