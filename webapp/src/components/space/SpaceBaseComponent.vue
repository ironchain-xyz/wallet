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
            <a-row justify="center" style="margin-bottom: 15px;">
                <span style="color: gray; font-size: 13px; font-weight: bold;">
                    {{ formatNumber(space.totalSubscribers || 0) }} subscribers
                </span>
            </a-row>
            <a-row justify="center">
                <SpaceSubscribe :id="space.id"/>
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
                <a-button
                    class="menuItem"
                    type="text"
                    style="font-weight: bold;"
                    @click="onNewMaterial"
                >
                    New Material
                </a-button>
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
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/store';
import { authenticated } from '@/services/auth';
import { Space, fetchSpace } from '@/services/space';
import router from '@/router';
import SpaceSubscribe from '@/components/space/content/SpaceSubscribeButtonComponent.vue';

export default defineComponent({
    components: { SpaceSubscribe },
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

        const formatNumber = (n: number) => {
            if (n < 1000) {
                return n;
            } else if (n < 1000000) {
                return Math.floor(n / 1000) + "K";
            } else if (n < 1000000000) {
                return Math.floor(n / 1000000) + "M";
            }
        };

        const onNewMaterial = () => {
            const url = '/space/' + space.value.id + '/newMaterial';
            if (authenticated(store)) {
                router.push(url)
            } else {
                store.commit("startLogin", url);
            }
        }

        return {
            space,
            onNewMaterial,
            formatNumber,
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