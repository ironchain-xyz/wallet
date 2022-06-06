<template>
  <div>
    <a-alert v-if="!!alert" :message="alert" type="error" style="margin-bottom: 20px;" />
    <a-input v-model:value="email" style="margin-bottom: 20px;" placeholder="Email">
      <template #prefix>
        <UserOutlined class="site-form-item-icon" />
      </template>
    </a-input>
    <a-input v-model:value="invitationCode" style="margin-bottom: 20px;" placeholder="Invitation Code">
    </a-input>
    <a-button type="primary" @click="onClick" class="login-form-button">
      Register
    </a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { useStore } from '../store';
import router from '../router';
import { register } from '../services/auth';

export default defineComponent({
  components: { UserOutlined, },
  setup() {
    const store = useStore();
    if (store.state.user?.jwt) {
      router.push('/');
      return;
    }

    const alert = ref<string>("");
    const email = ref<string>("");
    const invitationCode = ref<string>("");
    const onClick = (): void => {
      register(store, email.value, invitationCode.value).then(msg => {
        alert.value = msg
      });
    };

    return {
      email,
      invitationCode,
      alert,
      onClick,
    };
  },
});
</script>