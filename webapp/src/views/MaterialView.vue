<template>
  <ContentComponent>
    <MaterialComponent />
  </ContentComponent>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ContentComponent from '@/components/ContentComponent.vue';
import MaterialComponent from '@/components/material/MaterialComponent.vue';
import { Material, fetchMaterial } from '@/services/material';
import { useStore } from '@/store';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: { MaterialComponent, ContentComponent },
  setup() {
      const store = useStore();
      const route = useRoute();
      const material = ref<Material>();

      onMounted(() => {
          const hash = route.params.hash as string;
          fetchMaterial(store, hash).then(res => {
              material.value = res;
          });
      });

      return {
          material
      };
  },
})
</script>