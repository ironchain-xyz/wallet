<template>
  <div>
    <a-input-password v-model:value="otp" style="margin-bottom: 20px;" placeholder="Authentication Code">
      <template #prefix>
        <LockOutlined class="site-form-item-icon" />
      </template>
    </a-input-password>
    <a-button type="primary" @click="onClick" class="login-form-button">
      Login
    </a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { LockOutlined } from '@ant-design/icons-vue';
import { useStore } from '../store';
import router from '../router';
import { verifyOTP } from '../services/auth';

export default defineComponent({
  components: {
    LockOutlined,
  },
  setup() {
    const store = useStore();
    if (!store.state.user?.email || !store.state.user?.otpSentAt) {
      store.commit("clear");
      router.push('/login');
      return;
    }

    const otp = ref<string>('');
    const onClick = () => {
      verifyOTP(store, otp.value);
    };

    return {
      otp,
      onClick,
    };
  },
});
</script>
