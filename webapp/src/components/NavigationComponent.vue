<template>
  <a-affix :offset-top="top">
    <a-row class="nav-container">
      <a-col class="nav-item">
        <img alt="Vue logo" src="../assets/logo.png" style="width:50px; height:50px;">
      </a-col>
      <a-col style="margin-top: 10px">
        <a-menu mode="horizontal" class="menuItem">
          <a-menu-item key="discover">
            <template #icon>
              <home-outlined />
            </template>
            <a href="/">Discover</a>
          </a-menu-item>
          <a-menu-item key="home">
            <template #icon>
              <user-outlined />
            </template>
            <a href="/home">Home</a>
          </a-menu-item>
          <a-menu-item key="collections">
            <template #icon>
              <heart-outlined />
            </template>
            <a href="/collections">Collections</a>
          </a-menu-item>
          <a-menu-item key="profile">
            <template #icon>
              <setting-outlined />
            </template>
            <a href="/profile">Setting</a>
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col class="nav-item" style="margin-top: 20px">
        <a-tooltip placement="right">
          <template #title>
            <span>Create Record</span>
          </template>
          <a href="/record/new">
            <a-button type="primary" shape="circle">
              <template #icon><PlusOutlined /></template>
            </a-button>
          </a>     
        </a-tooltip>
      </a-col>
    </a-row>
  </a-affix>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UserOutlined, HomeOutlined, HeartOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useStore } from '../store';
import { logout } from '../services/auth';
import { string } from 'vue-types';

export default defineComponent({
  components: { UserOutlined, HomeOutlined, HeartOutlined, SettingOutlined, PlusOutlined },
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