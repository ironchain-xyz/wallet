<template>
    <a-row class="header" justify="space-between" align="middle">
        <a-col>
            <h3 style="font-weight: bold; margin: auto">IronchainDAO</h3>
        </a-col>
        <a-col>
            <a-popover v-if="username" trigger="click">
                <template #content>
                    <a-row>
                        <a-button type="text" href="/profile">  
                            <template #icon>
                                <UserOutlined />
                            </template>
                            Profile
                        </a-button>
                    </a-row>
                    <a-row>
                        <a-button type="text" @click="onLogout">
                            <template #icon>
                                <LogoutOutlined />
                            </template>
                            Logout
                        </a-button>
                    </a-row>
                </template>
                <a-button style="font-weight: bold;">
                    <a-avatar class="avatar" shape="square" :size="15">
                        {{ username.substring(0, 1).toUpperCase() }}
                    </a-avatar>
                    {{ username }}
                </a-button>
            </a-popover>
             <a-button v-if="!username" style="font-weight: bold;" @click="onLogin">
                Login
            </a-button>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import { useRoute } from 'vue-router'
import router from '@/router';
import { logout } from '@/services/auth';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: { UserOutlined, LogoutOutlined },
  setup() {
    const store = useStore();
    const route = useRoute();
    const username = computed(() => store.state.user?.username);

    const onLogin = () => {
        store.commit("startLogin", route.path);
    };

    const onLogout = () => {
        logout(store).then(() => {
            if (route.path.startsWith("/profile")) {
                router.push("/");
            } else {
                router.go(0);
            }
        });
    }

    return {
        username,
        onLogin,
        onLogout,
    };
  },
})
</script>

<style lang="less" scoped>
.avatar {
    margin-right: 5px;
    font-weight: bold;
    background-color: #209645;
}

.header {
    width: 100%;
    max-width: 700px
}

</style>