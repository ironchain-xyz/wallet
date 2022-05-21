<template>
  <NewEvent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NewEvent from '@/components/NewEventComponent.vue'; // @ is an alias to /src

@Options({
  components: {
    NewEvent,
  },
})
export default class NewEventView extends Vue {}
</script>