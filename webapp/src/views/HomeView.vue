<template>
  <Home title="B23"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Home from '@/components/IntroComponent.vue'; // @ is an alias to /src

@Options({
  components: {
    Home,
  },
})
export default class HomeView extends Vue {}
</script>