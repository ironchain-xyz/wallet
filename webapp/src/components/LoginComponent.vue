<template>
  <div>
    <a-input v-model:value="email"  placeholder="Email">
      <template #prefix>
        <UserOutlined class="site-form-item-icon" />
      </template>
    </a-input>
    <a-button type="primary" @click="onClick" class="login-form-button">
      Continue to Login
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
  components: {UserOutlined,},
  setup() {
    const store = useStore();
    if (store.state.user?.jwt) {
      router.push('/');
      return;
    }

    let email = ref<string>('');
    const onClick = () : void => {
      sendOTP(store, email.value);
    };

    return {
      email,
      onClick,
    };
  },
});
</script>
