<template>
  <Home />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Home from '@/components/HomeComponent.vue'; // @ is an alias to /src

@Options({
  components: {
    Home,
  },
})
export default class HomeView extends Vue { }
</script>