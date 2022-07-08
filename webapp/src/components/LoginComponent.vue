<template>
  <div>
    <a-modal :closable="false" :visible="visible">
      <a-alert
        v-if="!!alert.msg"
        :message="alert.msg"
        :type="alert.type"
        style="margin-bottom: 10px;"
      ></a-alert>
      <a-col class="form" v-if="step === 'email'">
        <a-input
          v-model:value="email"
          style="margin-bottom: 20px;"
          placeholder="please input your email"
        >
          <template #prefix>
            <MailOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-col>
      <a-col class="form" v-if="step === 'register'">
        <a-row justify="center" style="margin-bottom: 20px;">
          <a-typography-title :level="5">
            Create Account
          </a-typography-title>
        </a-row>
        <a-input
          v-model:value="username"
          placeholder="set your username"
        >
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
        <a-alert
          message="Rule: Only alphanumeric and dash are allowed, 3-20 characters"
          type="info"
          style="font-size: 10px; padding: 5px; margin-top: 5px;"
        />
        <a-input
          v-model:value="invitationCode"
          placeholder="an invitation code is required"
          style="margin-top: 20px;"
        >
          <template #prefix>
            <KeyOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-col>
      <a-col class="form" v-if="step === 'otp'">
        <a-input-password v-model:value="otp" placeholder="Please input the authentication code">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
        <a-button style="margin-top: 10px;" @click="onResendOTP" type="link" size="small">
          Resend the authentication code
        </a-button>
      </a-col>
      <template #footer>
        <a-button @click="onCancel">Cancel</a-button>
        <a-button v-if="step !== 'email'" @click="onPrev">Prev</a-button>
        <a-button v-if="step === 'email'" @click="onInputEmail">Next</a-button>
        <a-button v-if="step === 'register'" @click="onRegister">Next</a-button>
        <a-button v-if="step === 'otp'" @click="onVerifyOTP">Login</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { MailOutlined, UserOutlined, KeyOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';
import { isRegistered, register, sendOTP, verifyOTP, warnExistingOTP } from '@/services/auth';

interface Alert {
  msg: string,
  type: "error" | "warning" | "info",
}

function info(msg: string) : Alert {
  return {msg, type: "info"};
}

function error(msg: string) : Alert {
  return {msg, type: "error"};
}

function warning(msg: string) : Alert {
  return {msg, type: "warning"};
}

export default defineComponent({
  components: { MailOutlined, UserOutlined, KeyOutlined, LockOutlined },
  props: {
      visible: Boolean,
  },
  setup(_props, { emit }) {
    const store = useStore();
    const alert = ref<Alert>({msg: "", type: "error"});
    const step = ref<string>("email");
    const email = ref<string>("");
    const invitationCode = ref<string>("");
    const otp = ref<string>("");
    const username = ref<string>("");

    const nextStep = (next: string, alertObj=error("")) => {
      step.value = next;
      alert.value = alertObj;
    }

    const onInputEmail = (): void => {
      isRegistered(store, email.value).then(res => {
        if (res) {
          sendOTP(store, email.value)
            .then((res) => {
              if (res.data.existingOTP) {
                nextStep(
                    "otp",
                    warning(warnExistingOTP(res.data.sentAt))
                );
              } else {
                nextStep("otp", info("Check your email for authentication code"))
              }
            })
            .catch(err => alert.value = error(err.message))
        } else {
          nextStep("register");
        }
      }).catch(err => alert.value = error(err.message))
    };

    const onRegister = (): void => {
      register(store, email.value, username.value, invitationCode.value).then(() => {
        nextStep("otp", info("Check your email for authentication code"));
      }).catch(err => {
        alert.value = error(err.message)
      })
    };

    const onResendOTP = () => {
      if (store.state.user!.otp!.existing) {
        alert.value = warning(warnExistingOTP(store.state.user!.otp!.sentAt!));
      } else {
        sendOTP(store, store.state.user!.email)
          .then(res => {
            if (res.data.existingOTP) {
              alert.value = warning(warnExistingOTP(res.data.sentAt));
            }
          })
          .catch(err => {
            console.log(err);
            alert.value = error(err.message)
          });
      }
    };

    const onVerifyOTP = () => {
      verifyOTP(store, otp.value).then(() => {
        if (store.state.user?.profile?.username) {
          emit("loggedIn");
        }
      }).catch(err => alert.value = error(err.message));
    };

    const onPrev = () => {
      if (step.value === 'register' || step.value === 'otp') {
        step.value = 'email';
      }
    }

    const onCancel = () => {
      emit("cancel");
    };

    return {
      alert,
      step,
      email,
      otp,
      username,
      invitationCode,
      onInputEmail,
      onRegister,
      onResendOTP,
      onVerifyOTP,
      onCancel,
      onPrev,
    };
  },
});
</script>

<style lang="less" scoped>
.form {
  margin-top: 20px;
}
</style>