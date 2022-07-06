<template>
  <ContentComponent>
    <Materials :loadData="fetchLatestMaterials" />
  </ContentComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContentComponent from '@/components/ContentComponent.vue';
import Materials from '@/components/material/MaterialsComponent.vue';
import { fetchLatestMaterials } from '@/services/material';

export default defineComponent({
  components: { Materials, ContentComponent },
  setup() {
      return {
          fetchLatestMaterials,
      };
  },
})
</script>