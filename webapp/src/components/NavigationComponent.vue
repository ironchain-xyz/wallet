<template>
    <a-affix :offset-top="top" >
      <div class="nav-container">
        <div class="nav-item">
          <img alt="Vue logo" src="../assets/logo.png" style="width:50px; height:50px;">
        </div>
        <div style="margin-top: 10px">
          <a-menu mode="horizontal" class="menuItem">
            <a-menu-item key="events">
                <template #icon>
                    <home-outlined />
                </template>
                <a href="/">Home</a>
            </a-menu-item>
            <a-menu-item key="profile">
                <template #icon>
                    <user-outlined />
                </template>
                <a href="/profile">Profile</a>
            </a-menu-item>
          </a-menu>
        </div>
        <div class="nav-item">
          <a-button type="primary" @click="onLogout" style="font-size: 20px" size="large">
            Logout
          </a-button>
        </div>
      </div>
    </a-affix>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UserOutlined, HomeOutlined } from '@ant-design/icons-vue';
import router from '../router';
import { useStore } from '../store';
import { authenticate, logout } from '../services/auth';
import { string } from 'vue-types';

export default defineComponent({
  components: {UserOutlined, HomeOutlined},
  props: {
      tabKey: string,
  },
  setup() {
    const store = useStore();
    if (!authenticate(store)) return;
    if (!store.state.profile?.username) {
      router.push('init');
    }
    return {
      onLogout: () => logout(store),
    };
  },
})
</script>

<style lang="less" scoped>
.nav-container {
  display: flex;
  justify-content: center;
}

.nav-item {
    margin: 12px;
    font-size: 20px;
}

.menuItem {
    font-size: 20px;
}
</style>