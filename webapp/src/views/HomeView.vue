<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" style="width:200px; height:200px;">
    <Home title="B23"/>
  </div>
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
