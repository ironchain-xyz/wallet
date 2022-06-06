<template>
  <div>
    <a-alert v-if="!!alert" :message="alert" type="error" style="margin-bottom: 20px;" />
    <a href="register">Register New Account</a>
    <a-input v-model:value="email" placeholder="Email" style="margin-bottom: 20px;">
      <template #prefix>
        <UserOutlined class="site-form-item-icon" />
      </template>
    </a-input>
    <a-button type="primary" @click="onClick" class="login-form-button">
      Continue
    </a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { useStore } from '../store';
import router from '../router';
import { sendOTP } from '../services/auth';

export default defineComponent({
  components: { UserOutlined, },
  setup() {
    const store = useStore();
    if (store.state.user?.jwt) {
      router.push('/');
      return;
    }

    const email = ref<string>("");
    if (store.state.user?.email) {
      email.value = store.state.user?.email;
    }

    const alert = ref<string>("");
    const onClick = (): void => {
      sendOTP(store, email.value).then(msg => {
        alert.value = msg
        if (!msg) {
          router.push('/verify');
        }
      });
    };

    return {
      email,
      alert,
      onClick,
    };
  },
});
</script>