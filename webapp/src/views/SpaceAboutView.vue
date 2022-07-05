<template>
  <ContentComponent>
    <SpaceAbout />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ContentComponent from '@/components/ContentComponent.vue';
import SpaceAbout from '@/components/space/SpaceAboutComponent.vue';

@Options({
  components: {
    SpaceAbout,
    ContentComponent,
  },
})
export default class SpaceAboutView extends Vue { }
</script>