<template>
  <ContentComponent>
    <RecordComponent type="single" />
  </ContentComponent>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ContentComponent from '@/components/ContentComponent.vue';
import RecordComponent from '@/components/record/RecordComponent.vue';
import { Record, fetchRecord } from '@/services/record';
import { useStore } from '@/store';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: { RecordComponent, ContentComponent },
  setup() {
      const store = useStore();
      const route = useRoute();
      const record = ref<Record>();

      onMounted(() => {
          const hash = route.params.hash as string;
          fetchRecord(store, hash).then(res => {
              record.value = res;
          });
      });

      return {
          record
      };
  },
})
</script>