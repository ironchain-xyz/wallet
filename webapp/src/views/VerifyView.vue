<template>
  <div class="login">
    <a-row type="flex" justify="center" align="middle">
        <img alt="Vue logo" src="../assets/logo.png" style="width:200px; height:200px;">
    </a-row>
    <a-row type="flex" justify="center" align="middle">
        <Verify />
    </a-row>
  </div>
</template>

<script>
// @ is an alias to /src
import Verify from '@/components/VerifyComponent.vue'

export default {
  name: 'VerifyView',
  components: {
    Verify
  }
}
</script>