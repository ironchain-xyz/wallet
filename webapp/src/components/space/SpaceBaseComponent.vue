<template>
    <a-row v-if="space" :wrap="false" align="top">
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
            <a-row justify="center">
                <SpaceSubscribe :space="space"/>
            </a-row>
            <a-row style="margin-top: 30px;">
                <a-button
                    class="menuItem"
                    type="text"
                    style="font-weight: bold;"
                    :href="'/space/' + space.id"
                >
                    Materials
                </a-button>
            </a-row>
            <a-row>
                <a-dropdown placement="bottomLeft" trigger="click">
                    <a-button type="text" class="menuItem" @click.prevent>
                        Add Material
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="onAddImages">
                                Add Images
                            </a-menu-item>
                            <a-menu-divider />
                            <a-menu-item @click="onAddVideos">
                                Add Videos
                            </a-menu-item>
                            <a-menu-divider />
                            <a-menu-item @click="onAddLinks">
                                Add Links
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </a-row>
            <a-row>
                <a-button
                    class="menuItem"
                    type="text"
                    style="font-weight: bold;"
                    :href="'/space/' + space.id + '/about'"
                >
                    About
                </a-button>
            </a-row>
        </a-col>
        <a-col flex="auto" style="margin-left: 20px;">
            <slot :space="space"></slot>
        </a-col>
    </a-row>
    <SpaceAddMaterial
        :data="space"
        :type="materialType"
        :visible="!!materialType"
        @close="materialType = ''"
    />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/store';
import { authenticated } from '@/services/auth';
import { Space, fetchSpace } from '@/services/space';
import SpaceSubscribe from '@/components/space/content/SpaceSubscribeButtonComponent.vue';
import SpaceAddMaterial from '@/components/space/SpaceAddMaterialComponent.vue';

export default defineComponent({
    components: { SpaceSubscribe, SpaceAddMaterial },
    setup() {
        const store = useStore();
        const route = useRoute();

        const space = ref<Space>({
            id: 0,
            name: '',
            description: '',
            createdAt: '',
            totalSubscribers: 0,
            isSubscriber: false,
        });
        const errMsg = ref<string>('');

        onMounted(async () => {
            const id = route.params.id as string;
            const result = await fetchSpace(id);
            if (!result) {
                errMsg.value = 'Space Not Found'
            } else {
                space.value = result;
            }
        });

        const materialType = ref<string>('');
        const onAddMaterial = (type: string) => {
            const url = '/space/' + space.value.id + '/newMaterial';
            if (authenticated(store)) {
                materialType.value = type;
            } else {
                store.commit("startLogin", url);
            }
        }

        const onAddImages = () => {
            return onAddMaterial("image");
        }

        const onAddVideos = () => {
            return onAddMaterial("video");
        }

        const onAddLinks = () => {
            return onAddMaterial("link");
        }

        return {
            materialType,
            space,
            onAddImages,
            onAddVideos,
            onAddLinks,
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
    font-weight: bold;
}
</style>