<template>
  <ContentComponent>
    <SpaceNewMaterial />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ContentComponent from '@/components/ContentComponent.vue';
import SpaceNewMaterial from '@/components/space/SpaceNewMaterialComponent.vue';

@Options({
  components: {
    SpaceNewMaterial,
    ContentComponent,
  },
})
export default class SpaceNewMaterialView extends Vue { }
</script>