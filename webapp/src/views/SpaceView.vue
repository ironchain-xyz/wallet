<template>
  <ContentComponent>
    <Space />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ContentComponent from '@/components/ContentComponent.vue';
import Space from '@/components/space/SpaceComponent.vue';

@Options({
  components: {
    Space,
    ContentComponent,
  },
})
export default class SpacesView extends Vue { }
</script>