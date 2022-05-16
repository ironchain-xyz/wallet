<template>
  <div>
    <a-row type="flex" justify="center" align="middle">
        <img alt="Vue logo" src="../assets/logo.png">
    </a-row>
    <a-row type="flex" justify="center" align="middle">
        <InitProfile />
    </a-row>
  </div>
</template>

<script>
import InitProfile from '@/components/InitProfileComponent.vue'; // @ is an alias to /src

export default {
  name: 'InitProfileView',
  components: {
    InitProfile
  }
}
</script>