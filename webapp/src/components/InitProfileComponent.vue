<template>
  <div>
    <a-input v-model:value="username" style="margin-bottom: 20px;" placeholder="Username">
    </a-input>
    <a-button type="primary" @click="onSave" class="login-form-button">
      Save
    </a-button>
    <a-button type="primary" @click="onLogout" class="login-form-button">
      Logout
    </a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from '../store';
import { authenticate, logout } from '../services/auth';
import { initProfile } from "../services/profile";
import router from '@/router';

export default defineComponent({
  setup() {
    const store = useStore();
    if (!authenticate(store)) return;
    if (store.state.profile?.username) {
        router.push('/');
        return;
    }

    let username = ref<string>('');
    const onSave = () => {
      initProfile(store, {username: username.value});
    };
    const onLogout = () => {
      logout(store);
    }
    return {username, onSave, onLogout};
  },
});
</script>
