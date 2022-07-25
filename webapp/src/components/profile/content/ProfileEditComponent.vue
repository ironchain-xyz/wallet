<template>
    <a-modal :visible="visible" :closable="false" style="max-width: 300px;">
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
import { defineComponent, computed, ref } from 'vue';
import { UserOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';
import { updateProfile } from '@/services/user';
import { parseErrorMsg } from '@/services/utils';

export default defineComponent({
    components: { UserOutlined, CloseOutlined },
    props: {
        visible: Boolean,
    },
    setup(props, { emit }) {
        const store = useStore();

        const alert = ref<string>('');
        const username = computed(() => store.state.user!.username);
        const newUsername = ref<string>(store.state.user!.username!);

        const onSaveEdit = () => {
            alert.value = "";
            if (newUsername.value != username.value) {
                updateProfile(store, {username: newUsername.value})
                    .then(() => emit('close'))
                    .catch(err => alert.value = parseErrorMsg(err))
            } else {
                emit('close');
            }
        }

        const onCancel = () => {
            newUsername.value = store.state.user!.username;
            emit('close');
        }

       return {
            username,
            newUsername,
            alert,
            onSaveEdit,
            onCancel,
       }
    }
});
</script>
