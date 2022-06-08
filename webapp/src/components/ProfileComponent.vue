
<template>
    <div class="home">
        <Navigation />
        <div class="content">
            <div>
                <div class="field">
                    <a-alert v-if="!!alert" :message="alert" type="error" />
                </div>
                <div class="field">
                    <a-avatar :size="80" class="avatar">
                        {{ username.toUpperCase() }}
                    </a-avatar>
                </div>
                <div class="field">
                    <a-typography-title :level="4">Email</a-typography-title>
                    <a-typography-paragraph>{{ email }}</a-typography-paragraph>
                </div>
                <div class="field" style="max-width: 200px; margin-left: auto; margin-right: auto;">
                    <a-typography-title :level="4">Username</a-typography-title>
                    <a-typography-paragraph v-model:content="username" :editable="{ onEnd: onUsernameChange }">
                    </a-typography-paragraph>
                </div>
                <div class="field">
                    <a-typography-title :level="4">Invitation Codes</a-typography-title>
                    <div v-for="({ code, used }, index) in invitationCodes" v-bind:key="index">
                        <a-typography-paragraph :class="{ used, active: !used }" :copyable="!used">
                            {{ code }}
                        </a-typography-paragraph>
                    </div>
                </div>
                <div>
                    <a-button type="primary" @click="onLogout">
                        Logout
                    </a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onBeforeMount } from 'vue';
import { useStore } from '../store';
import { getInvitationCode, updateUsername } from '@/services/profile';
import Navigation from '@/components/NavigationComponent.vue'
import { logout } from '../services/auth';

interface InvitationCode {
    code: string;
    used: boolean;
}

export default defineComponent({
    components: { Navigation },
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
}

.avatar {
    font-weight: bold;
    background-color: #1890ff;
}
</style>