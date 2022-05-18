<template>
  <div class="login">
    <div>
        <a-row type="flex" justify="center" align="middle">
            <img alt="Vue logo" src="../assets/logo.png" style="width:200px; height:200px;">
        </a-row>
        <a-row type="flex" justify="center" align="middle">
            <Register />
        </a-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Register from '@/components/RegisterComponent.vue'

export default {
  name: 'RegisterView',
  components: {
    Register
  }
}
</script>