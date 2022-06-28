<template>
  <a-affix :offset-top="top">
    <a-row justify="center">
      <a-row class="nav-item">
        <a-menu>
          <a-row justify="center">
            <img alt="Vue logo" src="../assets/logo.png" style="width:60px; height:60px">
          </a-row>
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
          <a-row justify="center">
            <a href="/record/new">
              <a-button type="primary" shape="round" style="font-weight: bold;">
                Record
              </a-button>
            </a>  
          </a-row>
        </a-menu>
      </a-row>
    </a-row>
  </a-affix>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UserOutlined, HomeOutlined, HeartOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { useStore } from '../store';
import { logout } from '../services/auth';
import { string } from 'vue-types';

export default defineComponent({
  components: { UserOutlined, HomeOutlined, HeartOutlined, SettingOutlined },
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
a-menu-item {
  display: flex;
  justify-content: end;
}
</style>