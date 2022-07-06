<template>
    <a-row :wrap="false" align="top">
        <a-col class="border" flex="180px" style="height: auto;">
            <a-row justify="center">
                <a-avatar :size="55" class="avatar" shape="square">
                    {{ profile!.username.substring(0, 1).toUpperCase() }}
                </a-avatar>
            </a-row>
            <a-row justify="center" style="margin-top: 10px;">
                <a-typography-title strong :level="4">
                    {{ profile!.username }}
                </a-typography-title>
            </a-row>
            <a-row justify="center" style="margin-top: 5px;">
                <a-button
                    shape="round"
                    style="font-weight: bold;"
                    href="/"
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { fetchCreatedMaterials } from '@/services/material';

export default defineComponent({
    components: { },
    setup() {
        const store = useStore();
        const profile = store.state.profile;
        return {
            profile,
            fetchCreatedMaterials,
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