<template>
  <ContentComponent>
    <CollectedRecords />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CollectedRecords from '@/components/record/CollectedRecordsComponent.vue'
import ContentComponent from '@/components/ContentComponent.vue'

@Options({
  components: {
    ContentComponent,
    CollectedRecords,
  },
})
export default class DiscoverView extends Vue { }
</script>