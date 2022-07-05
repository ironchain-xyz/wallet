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
                    @click="onClick"
                >
                    Edit Profile
                </a-button>
            </a-row>
            <a-row style="margin-top: 30px;">
                <a-button
                    class="menuItem"
                    type="text"
                    style="font-weight: bold;"
                    @click="selected = 'records'"
                >
                    Materials
                </a-button>
            </a-row>
            <a-row>
                <a-button
                    class="menuItem"
                    type="text"
                    style="font-weight: bold;"
                    @click="selected = 'about'"
                >
                    About
                </a-button>
            </a-row>
        </a-col>
        <a-col flex="auto" style="margin-left: 20px;">
            <EditProfile v-if="selected == 'edit'"></EditProfile>
            <RecordsContainer v-if="selected == 'records'" :fetchRecords="fetchCreatedRecords"/>
            <ProfileAbout v-if="selected == 'about'"></ProfileAbout>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from '@/store';
import { fetchCreatedRecords } from '@/services/record';
import RecordsContainer from '@/components/record/RecordsContainerComponent.vue';
import ProfileAbout from '@/components/profile/ProfileAboutComponent.vue';
import EditProfile from '@/components/profile/EditProfileComponent.vue';

export default defineComponent({
    components: { EditProfile, RecordsContainer, ProfileAbout },
    setup() {
        const store = useStore();
        const selected = ref<string>("records");
        const profile = store.state.profile;
        const onClick = () => {
            selected.value = "edit";
        };

        return {
            profile,
            onClick,
            selected,
            fetchCreatedRecords,
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