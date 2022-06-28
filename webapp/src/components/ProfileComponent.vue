
<template>
    <a-col>
        <a-row justify="center" class="field" v-if="!!alert">
            <a-alert :message="alert" type="error" />
        </a-row>
        <a-row justify="center" class="field">
            <div>
                <a-typography-title :level="4">Username</a-typography-title>
                <a-typography-paragraph v-model:content="username" :editable="{ onEnd: onUsernameChange }">
                </a-typography-paragraph>
            </div>
        </a-row>
        <a-row justify="center" class="field">
            <div>
                <a-typography-title :level="4">Email</a-typography-title>
                <a-typography-paragraph>{{ email }}</a-typography-paragraph>
            </div>
        </a-row>
        <a-row justify="center" class="field">
            <div>
                <a-typography-title :level="4">Invitation Codes</a-typography-title>
                <a-row justify="center" v-for="({ code, used }, index) in invitationCodes" v-bind:key="index">
                    <a-typography-paragraph :class="{ used, active: !used }" :copyable="!used">
                        {{ code }}
                    </a-typography-paragraph>
                </a-row>
            </div>
        </a-row>
        <a-row justify="center" class="field">
            <a-button type="primary" @click="onLogout">
                Logout
            </a-button>
        </a-row>
    </a-col>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onBeforeMount } from 'vue';
import { useStore } from '@/store';
import { getInvitationCode, updateUsername } from '@/services/profile';
import { logout } from '@/services/auth';

interface InvitationCode {
    code: string;
    used: boolean;
}

export default defineComponent({
    setup() {
        const store = useStore();
        let alert = ref<string>('');
        let invitationCodes = reactive<InvitationCode[]>([]);
        onBeforeMount(() => {
            getInvitationCode(store).then((res) => {
                if (res.message) {
                    alert.value = res.message;
                } else if (res.codes && res.codes.length > 0) {
                    res.codes.forEach(code => {
                        invitationCodes.push(code)
                    });
                }
            })
        });
        const username = ref<string>(store.state.profile!.username!);
        const onUsernameChange = () => {
            updateUsername(store, username.value).then(() => {
                username.value = store.state.profile!.username!;
            })
        };
        const email = computed(() => store.state.user!.email);
        return {
            email,
            username,
            alert,
            invitationCodes,
            onUsernameChange,
            onLogout: () => logout(store),
        };
    },
});
</script>

<style lang="less" scoped>
.active {
    font-weight: bold;
}

.used {
    text-decoration: line-through;
    font-style: italic;
}

.field {
    margin-bottom: 50px;
    margin-left: auto;
    margin-right: auto;
}
</style>