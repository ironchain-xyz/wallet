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
            <setting-outlined />
          </template>
          Settings
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
import { defineComponent } from 'vue';
import { useStore } from '../store';
import { authenticate, logout } from '../services/auth';
import { SettingOutlined, HomeOutlined } from '@ant-design/icons-vue';
import router from '../router';

export default defineComponent({
  components: {SettingOutlined, HomeOutlined},
  setup() {
    const store = useStore();
    if (!authenticate(store)) return;
    if (!store.state.profile?.username) {
      router.push('init');
    }
    const onLogout = () => {
      logout(store);
    }
    console.log(store.state.user)
    return {onLogout};
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
