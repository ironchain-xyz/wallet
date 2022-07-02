<template>
    <a-row justify="space-between" align="middle">
        <a-col>
            <h3 style="font-weight: bold; margin: auto">IronchainDAO</h3>
        </a-col>
        <a-col>
            <a-popover trigger="click">
                <template #content>
                    <a-row>
                        <a-button type="link" href="/profile">  
                            <template #icon>
                                <UserOutlined />
                            </template>
                            Profile
                        </a-button>
                    </a-row>
                    <a-row>
                        <a-button type="link" href="/createdRecords">  
                            <template #icon>
                                <EditOutlined />
                            </template>
                            Created Records
                        </a-button>
                    </a-row>
                    <a-row>
                        <a-button type="link" href="/collections">
                            <template #icon>
                                <LikeOutlined />
                            </template>
                            Collections
                        </a-button>
                    </a-row>
                    <a-row>
                        <a-button type="link" @click="onLogout">
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
                    {{ action }}
                </a-button>
            </a-popover>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from '../store';
import { authenticate, logout } from '../services/auth';
import { UserOutlined, EditOutlined, LikeOutlined, LogoutOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: { UserOutlined, EditOutlined, LikeOutlined, LogoutOutlined },
  setup() {
    const store = useStore();
    const action = ref<string>("");
    if (!authenticate(store)) {
        action.value = "Login";
    }

    const username = computed(() => store.state.profile?.username!);
    action.value = username.value;

    return {
        action,
        username,
        onLogout: () => logout(store),
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
</style>