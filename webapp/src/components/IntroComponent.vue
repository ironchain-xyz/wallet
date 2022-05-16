<template>
  <div class="hello">
    <a-button type="primary" @click="onLogout" class="login-form-button">
      Logout
    </a-button>
    <h1>{{ title }}</h1>
    <h2>
      Bridge between Web2 and Web3.
    </h2>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useStore } from '../store';
import { authenticate, logout } from '../services/auth';
import router from '../router';

export default defineComponent({
  setup() {
    const store = useStore();
    if (!authenticate(store)) return;
    if (!store.state.profile?.username) {
      router.push('init');
    }
    const onLogout = () => {
      logout(store);
    }
    console.log(store.state.user)
    return {onLogout};
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
h1 {
  color: @heading-color;
}
h2 {
  color: @text-color;
}
</style>
