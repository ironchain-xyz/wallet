<template>
  <div>
    <a-alert v-if="!!alert" :message="alert" type="error" style="margin-bottom: 20px;" />
    <a-input-password v-model:value="otp" placeholder="Authentication Code">
      <template #prefix>
        <LockOutlined class="site-form-item-icon" />
      </template>
    </a-input-password>
    <div>
      <a-button type="text" @click="onResend" style="margin-bottom: 20px;">
        Resend the authentication code
      </a-button>
    </div>
    <div>
      <a-button type="primary" @click="onClick" class="login-form-button">
        Login
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { LockOutlined } from '@ant-design/icons-vue';
import { useStore } from '../store';
import router from '../router';
import { sendOTP, verifyOTP, warnExistingOTP } from '../services/auth';

export default defineComponent({
  components: {
    LockOutlined,
  },
  setup() {
    const store = useStore();
    if (!store.state.user?.email || !store.state.user?.otp) {
      store.commit("clear");
      router.push('/login');
      return;
    }

    const alert = ref<string>("");
    if (store.state.user!.otp!.existing) {
      alert.value = warnExistingOTP(store.state.user!.otp!.sentAt!);
    }

    const otp = ref<string>('');
    const onClick = () => {
      verifyOTP(store, otp.value).then(msg => {
        alert.value = msg;
        if (!msg) {
          router.push('/');
        }
      });
    };

    const onResend = () => {
      sendOTP(store, store.state.user!.email).then(msg => alert.value = msg);
    };

    return {
      otp,
      alert,
      onClick,
      onResend,
    };
  },
});
</script>
