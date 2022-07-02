<template>
    <a-row class="menu">
      <img alt="Vue logo" src="../assets/logo.png" style="width: 35px; height: 35px">
    </a-row>
    <a-row class="menu">
      <a href="/">
        <a-button shape="circle">
          <template #icon>
            <AppstoreOutlined />
          </template>
        </a-button>
      </a>
    </a-row>
    <a-row class="menu">
      <a href="/record/new">
        <a-button shape="circle">
          <template #icon>
            <PlusOutlined />
          </template>
        </a-button>
      </a>        
    </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useStore } from '../store';
import { logout } from '../services/auth';
import { string } from 'vue-types';

export default defineComponent({
  components: { AppstoreOutlined, PlusOutlined },
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
.menu {
  margin: 10px;
}
</style>