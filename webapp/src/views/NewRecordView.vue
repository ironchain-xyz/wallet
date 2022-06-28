<template>
  <ContentComponent>
    <NewRecordComponent />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NewRecordComponent from '@/components/NewRecordComponent.vue';
import ContentComponent from '@/components/ContentComponent.vue';

@Options({
  components: {
    ContentComponent,
    NewRecordComponent,
  },
})
export default class DiscoverView extends Vue { }
</script>
