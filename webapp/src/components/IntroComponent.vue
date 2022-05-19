<template>
  <div class="home">
    <div class="nav-container">
      <a-menu v-model:selectedKeys="current" mode="horizontal" style="margin-top: 10px;">
        <a-menu-item key="logo" disabled>
          <img alt="Vue logo" src="../assets/logo.png" style="width:20px; height:20px;">
        </a-menu-item>
        <a-menu-item key="intro">
          <template #icon>
            <home-outlined />
          </template>
          Home
        </a-menu-item>
        <a-menu-item key="settings">
          <template #icon>
            <user-outlined />
          </template>
          Profile
        </a-menu-item>
        <a-menu-item key="invitation code">
          <a-button type="primary" @click="onInvitationCode" class="login-form-button">
            Invitation Code
          </a-button>
        </a-menu-item>
        <a-menu-item key="logout">
          <a-button type="primary" @click="onLogout" class="login-form-button">
            Logout
          </a-button>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="content">
      <div>
        <h1>B23</h1>
        <h2>
          Bridge between Web2 and Web3.
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, h } from 'vue';
import { Modal } from 'ant-design-vue';
import { UserOutlined, HomeOutlined } from '@ant-design/icons-vue';
import router from '../router';
import { useStore } from '../store';
import { authenticate, logout } from '../services/auth';
import { getInvitationCode } from '../services/profile';

export default defineComponent({
  components: {UserOutlined, HomeOutlined},
  setup() {
    const store = useStore();
    if (!authenticate(store)) return;
    if (!store.state.profile?.username) {
      router.push('init');
    }

    const onLogout = () => {logout(store);}

    const genCodes = (res) => {
      if (res.message) {
        return h('p', "Failed to get invitation code with error: " + res.message);
      }
      if (res.codes && res.codes.length > 0) {
        return res.codes.map(code => h(
          'p',
          {
            style: code.used
            ? "text-decoration: line-through; font-style: italic;"
            : "font-weight: bold;"
          },
          code.code
        ));
      }
      return h('p', "No invitation code found");
    }
    const onInvitationCode = () => {
      getInvitationCode(store).then((res) => {
        Modal.info({
          title: 'Invitation Code',
          content: h('div', {style: "margin-top: 30px;"}, genCodes(res))
        });
      });
    }

    return {
      onLogout,
      onInvitationCode,
    };
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
h1 {
  color: @heading-color;
}
h2 {
  color: @text-color;
}

.nav-container {
  display: flex;
  justify-content: center;
}

.content {
  display: flex;
  justify-content: center;
  height: 100%;
  margin-top: 100px;
}
.home {
  height: 100%;
}
</style>
