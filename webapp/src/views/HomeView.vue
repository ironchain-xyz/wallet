<template>
  <ContentComponent>
    <CreatedRecords />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CreatedRecords from '@/components/record/CreatedRecordsComponent.vue';
import ContentComponent from '@/components/ContentComponent.vue';

@Options({
  components: {
    ContentComponent,
    CreatedRecords,
  },
})
export default class DiscoverView extends Vue { }
</script>


