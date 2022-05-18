<template>
  <div>
    <a-alert  v-if="!!alert" :message="alert" type="error" style="margin-bottom: 20px;"/>
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

    const alert = ref<string>("");
    const otp = ref<string>('');
    const onClick = () => {
      verifyOTP(store, otp.value).then(msg => alert.value = msg);
    };

    return {
      otp,
      alert,
      onClick,
    };
  },
});
</script>
