<template>
  <div>
    <a-alert v-if="!!alert" :message="alert" type="error" style="margin-bottom: 20px;" />
    <p>
      Please set your username:
      <br /> Rule: Only alphanumeric and dash are allowed, 3-20 characters
    </p>
    <a-input v-model:value="username" style="margin-bottom: 20px;" placeholder="Username">
    </a-input>
    <div>
      <a-button type="primary" @click="onSave" class="login-form-button" style="margin-bottom: 20px;">
        Save
      </a-button>
    </div>
    <div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from '../store';
import router from '../router';
import { initProfile } from "../services/profile";

export default defineComponent({
  setup() {
    const store = useStore();
    if (!store.state.user?.jwt) {
        store.commit("clear");
        router.push('/login');
        return false;
    }
    if (store.state.profile?.username) {
      router.push('/');
      return;
    }

    const alert = ref<string>("");
    let username = ref<string>('');
    const onSave = () => {
        initProfile(store, { username: username.value }).then(
            msg => alert.value = msg
        );
    };
    return { username, alert, onSave };
  },
});
</script>