<template>
  <Fact />
</template>

<script lang="ts">
import Fact from '@/components/FactComponent.vue'; // @ is an alias to /src

export default {
  name: 'FactView',
  components: {
    Fact
  }
}
</script>