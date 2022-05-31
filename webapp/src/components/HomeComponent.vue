<template>
  <div class="content">
    <Navigation />
    <div v-if="authenticated">
      <a-row justify="center" style="margin-bottom: 50px;">
        <a-button type="primary" size="large" href="/fact/new">
            Create your fact
        </a-button>
      </a-row>
      <a-row justify="center">
        <a-select
          v-model:value="mode"
          :options="options"
        >
        </a-select>
      </a-row>
      <a-row v-if="mode == 'created'" justify="center">
        <Facts mode="created"></Facts>
      </a-row>
      <a-row v-if="mode == 'collected'" justify="center">
        <Facts mode="collected"></Facts>
      </a-row>
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
    const mode = ref<string>("created");

    if (!authenticate(store)) {
      return;
    } else {
      authenticated.value = true;
    }

    const options = ref<any>([
      {
        value: 'created',
        label: 'Created Facts',
      },
      {
        value: 'collected',
        label: 'Collected Facts',
      },
    ]);

    return {
      authenticated,
      mode,
      options
    };
  },
})
</script>


<style lang="less" scoped>
.content {
    min-width: 50%;
}
</style>