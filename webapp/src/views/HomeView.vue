<template>
  <ContentComponent>
    <RecordsContainer type="created" />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ContentComponent from '@/components/ContentComponent.vue';
import RecordsContainer from '@/components/record/RecordsContainerComponent.vue';

@Options({
  components: {
    RecordsContainer,
    ContentComponent,
  },
})
export default class DiscoverView extends Vue { }
</script>