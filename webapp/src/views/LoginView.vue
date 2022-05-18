<template>
  <div class="login">
    <a-row type="flex" justify="center" align="middle">
        <img alt="Vue logo" src="../assets/logo.png" style="width:200px; height:200px;">
    </a-row>
    <a-row type="flex" justify="center" align="middle">
        <Login />
    </a-row>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/LoginComponent.vue'

export default {
  name: 'LoginView',
  components: {
    Login
  }
}
</script>