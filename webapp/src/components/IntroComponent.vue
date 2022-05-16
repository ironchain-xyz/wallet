<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <h2>
      Bridge between Web2 and Web3.
    </h2>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useStore } from '../store';
import router from '../router';

export default defineComponent({
  setup() {
    const store = useStore();
    if (!store.state.user?.email) { 
      store.commit("setUser", undefined);
      router.push('/login');
      return;
    }

    if (!store.state.user?.jwt) {
      router.push('/verify');
      return;
    }
  
    if (!store.state.profile?.username) {
      router.push('/profile/init');
      return;
    }
  }
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
