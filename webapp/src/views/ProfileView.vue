<template>
  <Profile/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Profile from '@/components/ProfileComponent.vue'; // @ is an alias to /src

@Options({
  components: {
    Profile,
  },
})
export default class HomeView extends Vue {}
</script>