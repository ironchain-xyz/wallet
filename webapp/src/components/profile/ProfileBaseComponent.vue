<template>
    <a-row v-if="username" :wrap="false" align="top">
        <a-col class="border" flex="180px" style="height: auto;">
            <a-row justify="center">
                <a-avatar :size="55" class="avatar" shape="square">
                    {{ username.substring(0, 1).toUpperCase() }}
                </a-avatar>
            </a-row>
            <a-row justify="center" style="margin-top: 10px;">
                <a-typography-title strong :level="4">
                    {{ username }}
                </a-typography-title>
            </a-row>
            <a-row justify="center" style="margin-top: 5px;">
                <a-button
                    shape="round"
                    style="font-weight: bold;"
                    @click="showEdit = true"
                >
                    Edit Profile
                </a-button>
            </a-row>
            <a-row style="margin-top: 30px;">
                <a-button
                    class="menuItem"
                    type="text"
                    style="font-weight: bold;"
                    href="/profile"
                >
                    Materials
                </a-button>
            </a-row>
            <a-row>
                <a-button
                    class="menuItem"
                    type="text"
                    style="font-weight: bold;"
                    href="/profile/about"
                >
                    About
                </a-button>
            </a-row>
        </a-col>
        <a-col flex="auto" style="margin-left: 20px;">
            <slot></slot>
        </a-col>
    </a-row>
    <a-modal :visible="showEdit" :closable="false" style="max-width: 300px;">
        <a-row justify="end">
            <a-button type="text" @click="onCancel">
                <template #icon>
                    <CloseOutlined class="site-form-item-icon" />
                </template>
            </a-button>
        </a-row>
        <a-col>
            <a-row justify="center" style="margin-bottom: 20px;">
                <a-typography-title :level="5">
                    Update Profile
                </a-typography-title>
            </a-row>
            <a-typography-text>Username</a-typography-text>
            <a-input v-model:value="newUsername">
                <template #prefix>
                    <UserOutlined />
                </template>
            </a-input>
            <a-alert
                message="Rule: Only alphanumeric and dash are allowed, 3-20 characters"
                type="info"
                style="font-size: 10px; padding: 5px; margin-top: 5px;"
            />
            <a-alert
                v-if="!!alert"
                :message="alert"
                type="error"
                style="margin-top: 20px;"
            />
        </a-col>
        <template #footer>
            <a-row justify="center">
                <a-button @click="onSaveEdit">Save</a-button>
            </a-row>
        </template>
    </a-modal>
</template>

<script lang="ts">
import { UserOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { defineComponent, computed, ref } from 'vue';
import router from "@/router";
import { useStore } from '@/store';
import { authenticated } from '@/services/auth';
import { updateProfile } from '@/services/user';
import { parseErrorMsg } from '@/services/utils';

export default defineComponent({
    components: { UserOutlined, CloseOutlined },
    setup() {
        const store = useStore();
        if (!authenticated(store)) {
            router.push("/");
            return {};
        }

        const showEdit = ref<boolean>(false);
        const username = computed(() => store.state.user!.username);
        const newUsername = ref<string>(store.state.user!.username!);
        const alert = ref<string>("");

        const onSaveEdit = () => {
            alert.value = "";
            if (newUsername.value != username.value) {
                updateProfile(store, {username: newUsername.value})
                    .then(() => showEdit.value = false)
                    .catch(err => alert.value = parseErrorMsg(err))
            } else {
                showEdit.value = false
            }
        }

        const onCancel = () => {
            newUsername.value = store.state.user!.username;
            showEdit.value = false;
        }

        return {
            username,
            newUsername,
            alert,
            showEdit,
            onSaveEdit,
            onCancel,
        };    
    }
});
</script>

<style lang="less" scoped>
.menuItem {
    margin-bottom: 0px;
    font-size: 13px;
    color: gray;
}

.avatar {
    font-weight: bold;
    background-color: #209645;
}
</style>