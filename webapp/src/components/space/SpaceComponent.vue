<template>
    <a-row :wrap="false" align="top">
        <a-col class="border" flex="180px" style="height: auto;">
            <a-row justify="center">
                <a-avatar :size="55" class="avatar" shape="square">
                    {{ space.name.substring(0, 1).toUpperCase() }}
                </a-avatar>
            </a-row>
            <a-row justify="center">
                <a-typography-title strong :level="4">
                    {{ space.name }}
                </a-typography-title>
            </a-row>
            <a-row justify="center" style="margin-bottom: 15px;">
                <span style="color: gray; font-size: 13px; font-weight: bold;">
                    {{ formatNumber(space.totalMembers) }} members
                </span>
            </a-row>
            <a-row justify="center">
                <a-button
                    shape="round"
                    :type="actionType"
                    style="font-weight: bold;"
                    @mouseover="mouseOver = true"
                    @mouseleave="mouseOver = false"
                    @click="onClick"
                >
                    {{ action }}
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
                    @click="selected = 'new'"
                >
                    New Material
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
            <SpaceRecords v-if="selected == 'records'" :space="space"></SpaceRecords>
            <NewRecord v-if="selected == 'new'" :space="space"></NewRecord>
            <SpaceAbout v-if="selected == 'about'" :space="space"></SpaceAbout>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Space, fetchSpace, joinSpace, leaveSpace } from '@/services/space';
import { useStore } from '@/store';
import NewRecord from '@/components/record/NewRecordComponent.vue';
import SpaceRecords from '@/components/space/SpaceRecordsComponent.vue';
import SpaceAbout from '@/components/space/SpaceAboutComponent.vue';

export default defineComponent({
    components: { SpaceRecords, SpaceAbout, NewRecord },
    setup() {
        const store = useStore();
        const route = useRoute();

        const selected = ref<string>("records");
        const space = ref<Space>({
            name: '',
            description: '',
            id: '',
            createdAt: '',
            totalMembers: 0,
            isMember: false,
        });
        const errMsg = ref<string>('');

        onMounted(async () => {
            const id = route.params.id as string;
            const result = await fetchSpace(store, id);
            if (!result) {
                errMsg.value = 'Space Not Found'
            } else {
                space.value = result;
            }
        });

        const mouseOver = ref<boolean>(false);
        const action = computed(() => {
            if (!space.value.isMember) {
                return "Join";
            } else if (mouseOver.value) {
                return "Leave";
            } else {
                return "Joined";
            }
        });

        const actionType = computed(() => {
            if (space.value.isMember && mouseOver.value) {
                return "danger";
            }
            return "";
        });

        const formatNumber = (n: number) => {
            if (n < 1000) {
                return n;
            } else if (n < 1000000) {
                return Math.floor(n / 1000) + "K";
            } else if (n < 1000000000) {
                return Math.floor(n / 1000000) + "M";
            }
        };

        const onClick = () => {
            if (!space.value.isMember) {
                joinSpace(store, space.value.id).then(() => {
                    space.value.isMember = true;
                }).catch(err => {
                    console.log(err);
                });
            } else {
                leaveSpace(store, space.value.id).then(() => {
                    space.value.isMember = false;
                }).catch(err => {
                    console.log(err);
                });
            }
        };

        return {
            mouseOver,
            action,
            actionType,
            space,
            onClick,
            formatNumber,
            selected,
        };
    }
});
</script>

<style lang="less" scoped>
.avatar {
    font-weight: bold;
    background-color: #209645;
}

.menuItem {
    margin-bottom: 0px;
    font-size: 13px;
    color: gray;
}
</style>