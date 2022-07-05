<template>
  <ContentComponent>
    <Spaces />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ContentComponent from '@/components/ContentComponent.vue';
import Spaces from '@/components/space/SpacesComponent.vue';

@Options({
  components: {
    Spaces,
    ContentComponent,
  },
})
export default class SpacesView extends Vue { }
</script>