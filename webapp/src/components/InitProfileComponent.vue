<template>
  <div>
    <a-alert v-if="!!alert" :message="alert" type="error" style="margin-bottom: 20px;"/>
    <p>
      Please set your username:
      <br/> Rule: Only alphanumeric and dash are allowed, 3-20 characters </p>
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

    const alert = ref<string>("");
    let username = ref<string>('');
    const onSave = () => {
      initProfile(store, {username: username.value}).then(msg => alert.value = msg);
    };
    const onLogout = () => {
      logout(store);
    }
    return {username, alert, onSave, onLogout};
  },
});
</script>
