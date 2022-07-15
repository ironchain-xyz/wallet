<template>
  <ContentComponent>
    <NewSpace />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ContentComponent from '@/components/ContentComponent.vue';
import NewSpace from '@/components/space/NewSpaceComponent.vue';

@Options({
  components: {
    NewSpace,
    ContentComponent,
  },
})
export default class NewSpaceView extends Vue { }
</script>