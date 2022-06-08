<template>
  <div class="content">
    <Navigation />
    <div style="padding-bottom: 100px;" v-if="authenticated">
        <a-row justify="center">
            <CollectedRecords />
        </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navigation from '@/components/NavigationComponent.vue'
import CollectedRecords from '@/components/record/CollectedRecordsComponent.vue'

import { useStore } from '../store';
import { authenticate } from '../services/auth';

export default defineComponent({
  components: { Navigation, CollectedRecords },
  setup() {
    const store = useStore();
    const authenticated = ref<boolean>(false);
    if (!authenticate(store)) {
        return;
    } else {
        authenticated.value = true;
    }

    return {
        authenticated,
    };
  },
})
</script>


<style lang="less" scoped>
.content {
    min-width: 50%;
    padding-bottom: 200px;
}
</style>