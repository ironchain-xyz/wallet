<template>
  <ContentComponent>
    <SpaceMaterials />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ContentComponent from '@/components/ContentComponent.vue';
import SpaceMaterials from '@/components/space/SpaceMaterialsComponent.vue';

@Options({
  components: {
    SpaceMaterials,
    ContentComponent,
  },
})
export default class SpacesView extends Vue { }
</script>