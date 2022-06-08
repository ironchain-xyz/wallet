<template>
  <CollectedRecords />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CollectedRecords from '@/components/record/CollectedRecordsComponent.vue'; // @ is an alias to /src

@Options({
  components: {
    CollectedRecords,
  },
})
export default class CollectedRecordsView extends Vue { }
</script>