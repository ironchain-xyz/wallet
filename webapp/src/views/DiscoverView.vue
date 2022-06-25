<template>
  <Discover />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Discover from '@/components/DiscoverComponent.vue'; // @ is an alias to /src

@Options({
  components: {
    Discover,
  },
})
export default class DiscoverView extends Vue { }
</script>