<template>
  <div class="content">
    <Navigation />
    <div v-if="authenticated">
      <a-row justify="center" style="margin-bottom: 50px;">
        <a-button type="primary" size="large" href="/record/new">
            Create a record
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
        <Records mode="created"></Records>
      </a-row>
      <a-row v-if="mode == 'collected'" justify="center">
        <Records mode="collected"></Records>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navigation from '@/components/NavigationComponent.vue'
import Records from '@/components/RecordsComponent.vue'
import { useStore } from '../store';
import { authenticate } from '../services/auth';

export default defineComponent({
  components: { Navigation, Records },
  setup() {
    const store = useStore();
    const authenticated = ref<boolean>(false);
    const mode = ref<string>("created");

    if (!authenticate(store)) {
      return;
    }

    authenticated.value = true;
    const options = ref<any>([
      {
        value: 'created',
        label: 'Created Records',
      },
      {
        value: 'collected',
        label: 'Collected Records',
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