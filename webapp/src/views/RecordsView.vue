<template>
  <ContentComponent>
    <RecordsContainer :fetchRecords="fetchLatestRecords" />
  </ContentComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContentComponent from '@/components/ContentComponent.vue';
import RecordsContainer from '@/components/record/RecordsContainerComponent.vue';
import {fetchLatestRecords} from '@/services/record';

export default defineComponent({
  components: { RecordsContainer, ContentComponent },
  setup() {
    return {
        fetchLatestRecords,
    };
  },
})
</script>