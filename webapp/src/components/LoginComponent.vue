<template>
  <div>
    <a-modal style="max-width: 300px;" :closable="false" :visible="showLogin">
      <a-row justify="end">
        <a-button type="text" @click="onCancel">
          <template #icon>
            <CloseOutlined class="site-form-item-icon" />
          </template>
        </a-button>
      </a-row>
      <a-col class="form" v-if="step === 'email'">
        <a-row justify="center" style="margin-bottom: 20px;">
          <a-typography-title :level="5">
            Login
          </a-typography-title>
        </a-row>
        <a-typography-text :level="5">
          Email
        </a-typography-text>
        <a-input v-model:value="email" /> 
      </a-col>
      <a-col class="form" v-if="step === 'register'">
        <a-row style="margin-bottom: 20px;">
          <a-alert type="warning" message="Email is not registered, please sign up" />
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
          placeholder="invitation code is required"
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
      <a-alert
        v-if="!!alert.msg"
        :message="alert.msg"
        :type="alert.type"
        style="margin-top: 10px;"
      ></a-alert>
      <template #footer>
        <a-row justify="center">
          <a-button v-if="step !== 'email'" @click="onPrev">Prev</a-button>
          <a-button v-if="step === 'email'" @click="onInputEmail">Next</a-button>
          <a-button v-if="step === 'register'" @click="onRegister">Next</a-button>
          <a-button v-if="step === 'otp'" @click="onVerifyOTP">Login</a-button>
        </a-row>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import router from '@/router';
import { UserOutlined, KeyOutlined, LockOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';
import { isRegistered, register, sendOTP, verifyOTP, warnExistingOTP } from '@/services/auth';
import { parseErrorMsg } from '@/services/utils';
import { getInvitationCode } from '@/services/user';
import { fetchSubscribedSpaces } from '@/services/space';
import { Store } from 'vuex';
import { State } from "@/store";

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

async function postLogin(store: Store<State>) {
    const [invitationCodes, subscriptions] = await Promise.all([
        getInvitationCode(store),
        fetchSubscribedSpaces(store.state.user!.id)
    ]);
    store.commit("setInvitationCodes", invitationCodes.codes);
    store.commit("setSubscription", subscriptions.map(s => s.space));
}

export default defineComponent({
  components: { UserOutlined, KeyOutlined, LockOutlined, CloseOutlined },
  setup() {
    const store = useStore();
    const alert = ref<Alert>({msg: "", type: "error"});
    const step = ref<string>("email");
    const email = ref<string>("");
    const invitationCode = ref<string>("");
    const otp = ref<string>("");
    const username = ref<string>("");

    const showLogin = computed(() => store.state.login.loggingIn);

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
            .catch(err => alert.value = error(parseErrorMsg(err)))
        } else {
          nextStep("register");
        }
      }).catch(err => alert.value = error(parseErrorMsg(err)))
    };

    const onRegister = (): void => {
      register(store, email.value, username.value, invitationCode.value)
        .then(() => nextStep("otp", info("Check your email for authentication code")))
        .catch(err => alert.value = error(parseErrorMsg(err)));
    };

    const onResendOTP = () => {
      sendOTP(store, email.value)
        .then(res => {
          if (res.data.existingOTP) {
            alert.value = warning(warnExistingOTP(res.data.sentAt));
          }
        })
        .catch(err => alert.value = error(parseErrorMsg(err)));
    };

    const onVerifyOTP = () => {
      verifyOTP(store, email.value, otp.value)
        .then(() => {
          store.commit("endLogin");
          return postLogin(store);
        })
        .then(() => router.push(store.state.login.destination))
        .catch(err => alert.value = error(parseErrorMsg(err)));
    };

    const onPrev = () => {
      if (step.value == 'otp') {
        otp.value = '';
      } else if (step.value == 'register') {
        invitationCode.value = '';
        username.value = '';
      }
      step.value = 'email';
      alert.value.msg = '';
    }

    const onCancel = () => {
      store.commit("endLogin");
    }

    return {
      alert,
      step,
      email,
      otp,
      username,
      invitationCode,
      showLogin,
      onInputEmail,
      onRegister,
      onResendOTP,
      onVerifyOTP,
      onPrev,
      onCancel,
    };
  },
});
</script>

<style lang="less" scoped>
.form {
  margin-top: 20px;
}

.login-modal {
  max-width: 200px;
}
</style>