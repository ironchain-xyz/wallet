<template>
    <a-row class="menu">
        <img alt="Vue logo" src="../assets/logo.png" style="width: 35px; height: 35px" />
    </a-row>
    <a-row class="menu">
        <a-tooltip placement="right" title="Spaces">
            <a href="/">
                <a-button shape="circle" >
                    <template #icon>
                        <AppstoreOutlined />
                    </template>
                </a-button>
            </a>
        </a-tooltip>
    </a-row>
    <a-row class="menu">
        <a-tooltip placement="right" title="New Space">
            <a-button shape="circle" @click="onClick">
                <template #icon>
                    <PlusOutlined />
                </template>
            </a-button>     
        </a-tooltip>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';
import { logout, authenticated } from '@/services/auth';
import { string } from 'vue-types';
import router from "@/router";

export default defineComponent({
  components: { AppstoreOutlined, PlusOutlined },
  props: {
    tabKey: string,
  },
  setup() {
    const store = useStore();
    const auth = computed(() => authenticated(store));

    const onClick = () => {
        if (auth.value) {
            router.push("/space/new");
        } else {
            store.commit("startLogin", "/space/new");
        }
    };

    return {
        onClick,
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