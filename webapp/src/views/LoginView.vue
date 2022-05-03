<template>
  <div class="login">
    <a-row type="flex" justify="center" align="middle">
      <a-col :span="12">
        <img alt="Vue logo" src="../assets/logo.png">
      </a-col>
      <a-col :span="12">
        <Login/>
      </a-col>
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
