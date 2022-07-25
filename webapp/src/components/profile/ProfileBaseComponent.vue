<template>
    <a-row v-if="username" :wrap="false" align="top">
        <a-col class="border" flex="180px" style="height: auto;">
            <a-row justify="center">
                <a-avatar :size="55" class="avatar" shape="square">
                    {{ username.substring(0, 1).toUpperCase() }}
                </a-avatar>
            </a-row>
            <a-row justify="center" style="margin-top: 10px;">
                <a-typography-title strong :level="4" style="inline-size: 140px; overflow-wrap: break-word;">
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
    <ProfileEdit :visible="showEdit" @close="showEdit = false" />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import router from "@/router";
import { useStore } from '@/store';
import { authenticated } from '@/services/auth';
import ProfileEdit from '@/components/profile/content/ProfileEditComponent.vue';

export default defineComponent({
    components: { ProfileEdit },
    setup() {
        const store = useStore();
        if (!authenticated(store)) {
            router.push("/");
            return {};
        }

        const showEdit = ref<boolean>(false);
        const username = computed(() => store.state.user!.username);

        return {
            username,
            showEdit,
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