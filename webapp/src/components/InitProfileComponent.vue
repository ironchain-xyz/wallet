<template>
  <div>
    <a-input v-model:value="username" style="margin-bottom: 20px;" placeholder="Username">
    </a-input>
    <a-button type="primary" @click="onClick" class="login-form-button">
      Submit
    </a-button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useStore } from '../store';
import router from '../router';
import { initProfile } from "../services/profile";

export default {
  setup() {
    const store = useStore();
    console.log(store.state.user);
    if (!store.state.user?.jwt) {
      router.push('/login');
      return;
    }

    let username = ref<string>('');
    const onClick = () : void => {
      initProfile(store, {username: username.value});
    };

    return {
      username,
      onClick,
    };
  },
};
</script>
