<template>
  <div class="login">
    <a-row type="flex" justify="center" align="middle">
        <img alt="Vue logo" src="../assets/logo.png">
    </a-row>
    <a-row type="flex" justify="center" align="middle">
        <InitProfile />
    </a-row>
  </div>
</template>

<script>
// @ is an alias to /src
import InitProfile from '@/components/InitProfileComponent.vue'

export default {
  name: 'InitProfile',
  components: {
    InitProfile
  }
}
</script>