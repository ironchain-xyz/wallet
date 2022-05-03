<template>
  <a-form
    :label-col="labelCol"
    :model="formState"
    name="login"
    class="login-form"
    v-bind="formItemLayout"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="Account Name"
      name="userName"
      :rules="[{ required: true, message: 'Please input your account name!' }]"
    >
      <a-row type="flex" gutter="16" justify="left" align="middle">
        <a-col :span="12">
          <a-input v-model:value="formState.userName" placeholder="E-mail">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-col>
      
        <a-col :span="6">
          <a-button>Send</a-button>
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item
      label="Access Code"
      name="accessCode"
      :rules="[{ required: true, message: 'Please input your access code!' }]"
    >
      <a-row type="flex" gutter="16" justify="left" align="middle">
        <a-col :span="12">
          <a-input-password v-model:value="formState.accessCode" placeholder="Get by E-mail">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item>
      <a-row type="flex" gutter="16" justify="space-around" align="middle">
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          Log in
        </a-button>
      </a-row>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
interface FormState {
  userName: string;
  accessCode: string;
  remember: boolean;
}
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const formItemLayout = {
      labelCol: { span: 8 }
    };
    const formState = reactive<FormState>({
      userName: '',
      accessCode: '',
      remember: true,
    });
    const onFinish = (values: any) => {
      console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    const disabled = computed(() => {
      return !(formState.userName && formState.accessCode);
    });
    return {
      formItemLayout,
      formState,
      onFinish,
      onFinishFailed,
      disabled,
    };
  },
});
</script>

<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#components-form-demo-normal-login .login-form-forgot {
  margin-bottom: 24px;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
