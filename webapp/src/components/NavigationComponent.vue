<template>
    <a-row class="menu">
        <img alt="Vue logo" src="../assets/logo.png" style="width: 35px; height: 35px" />
    </a-row>
    <a-row class="menu">
        <a-tooltip placement="right" title="Spaces">
            <a href="/">
                <a-button shape="square" >
                    <template #icon>
                        <AppstoreOutlined />
                    </template>
                </a-button>
            </a>
        </a-tooltip>
    </a-row>
    <a-row class="menu" v-for="space in subscription" v-bind:key="space.id">
        <a-tooltip placement="right" :title="space.name">
            <a :href='"/space/" + space.id'>
                <a-avatar class="avatar" shape="square">
                    {{ space.name.substring(0, 1).toUpperCase() }}
                </a-avatar>
            </a>
        </a-tooltip>
    </a-row>
    <a-row class="menu">
        <a-tooltip placement="right" title="New Space">
            <a-button shape="square" @click="onClick">
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
    const subscription = computed(() => Object.values(store.state.user?.subscription || {}));

    const onClick = () => {
        if (auth.value) {
            router.push("/space/new");
        } else {
            store.commit("startLogin", "/space/new");
        }
    };

    return {
        onClick,
        subscription,
        onLogout: () => logout(store),
    };
  },
})
</script>

<style lang="less" scoped>
.menu {
  margin: 10px;
}

.avatar {
    font-weight: bold;
    background-color: #209645;
}
</style>