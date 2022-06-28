<template>
  <ContentComponent>
    <DiscoverRecords />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import DiscoverRecords from '@/components/record/DiscoverRecordsComponent.vue'
import ContentComponent from '@/components/ContentComponent.vue'

@Options({
  components: {
    ContentComponent,
    DiscoverRecords,
  },
})
export default class DiscoverView extends Vue { }
</script>