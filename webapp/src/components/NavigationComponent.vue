<template>
  <a-affix :offset-top="top">
    <div class="nav-container">
      <div class="nav-item">
        <img alt="Vue logo" src="../assets/logo.png" style="width:50px; height:50px;">
      </div>
      <div style="margin-top: 10px">
        <a-menu mode="horizontal" class="menuItem">
          <a-menu-item key="home">
            <template #icon>
              <home-outlined />
            </template>
            <a href="/">Home</a>
          </a-menu-item>
          <a-menu-item key="collections">
            <template #icon>
              <heart-outlined />
            </template>
            <a href="/collections">Collections</a>
          </a-menu-item>
          <a-menu-item key="profile">
            <template #icon>
              <user-outlined />
            </template>
            <a href="/profile">Profile</a>
          </a-menu-item>
        </a-menu>
      </div>
    </div>
  </a-affix>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UserOutlined, HomeOutlined, HeartOutlined } from '@ant-design/icons-vue';
import { useStore } from '../store';
import { logout } from '../services/auth';
import { string } from 'vue-types';

export default defineComponent({
  components: { UserOutlined, HomeOutlined, HeartOutlined },
  props: {
    tabKey: string,
  },
  setup() {
    const store = useStore();
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