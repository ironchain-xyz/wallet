<template>
    <ContentComponent>
        <a-row style="margin: 10px 0px;">
            <a-button
              type="text"
              size="small"
              :href="'/space/' + material?.space"
            >
              <template #icon>
                <ArrowLeftOutlined style="color: gray;"/>
              </template>
              <span style="font-weight: bold; color: gray;">Back</span>
            </a-button>
        </a-row>
        <div class="border">
            <MaterialComponent v-if="material" :data="material" />
        </div>
    </ContentComponent>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount } from 'vue';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import ContentComponent from '@/components/ContentComponent.vue';
import MaterialComponent from '@/components/material/MaterialComponent.vue';
import { Material, fetchMaterial } from '@/services/material';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: { MaterialComponent, ContentComponent, ArrowLeftOutlined },
  setup() {
      const material = ref<Material>();
      const route = useRoute();
      const hash = route.params.hash as string;

      onBeforeMount(() => {
          fetchMaterial(hash).then(res => {
              material.value = res;
          });
      });

      return {
          material
      };
  },
})
</script>