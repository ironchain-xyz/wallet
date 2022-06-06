<template>
  <NewRecord />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NewRecord from '@/components/NewRecordComponent.vue'; // @ is an alias to /src

@Options({
  components: {
    NewRecord,
  },
})
export default class NewRecordView extends Vue { }
</script>