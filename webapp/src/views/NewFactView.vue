<template>
  <NewFact />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NewFact from '@/components/NewFactComponent.vue'; // @ is an alias to /src

@Options({
  components: {
    NewFact,
  },
})
export default class NewFactView extends Vue { }
</script>