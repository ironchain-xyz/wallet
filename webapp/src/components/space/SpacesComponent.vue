<template>
    <a-row class="space">
        <a-typography-text>
            {{ formatNumber(totalSpaces) }} space(s)
        </a-typography-text>
    </a-row>
    <a-list
        class="spaces"
        :loading="initLoading"
        :data-source="spaces"
        :grid="{xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4, xxxl: 4}"
    >
        <template #loadMore>
            <a-spin v-if="loadingMore" />
            <a-button v-if="!loadingMore && !noMore" @click="loadMore">loading more</a-button>
        </template>
        <template #renderItem="{ item }">
            <SpaceOverview class="space" :space="item" @onJoin="onJoin" @onLeave="onLeave" />
        </template>
    </a-list>
    <a-row v-if="!!errMsg" style="margin-top: 100px;">
        <span>{{ errMsg }}</span>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { parseErrorMsg } from '@/services/utils';
import { useStore } from '@/store';
import { Space, SpaceQuery, fetchSpaces } from '@/services/space';
import SpaceOverview from '@/components/space/content/SpaceOverviewComponent.vue';

export default defineComponent({
    components: { SpaceOverview },
    setup() {
        const store = useStore();

        const totalSpaces = ref<number>(0);

        const initLoading = ref(true);
        const loadingMore = ref(false);
        const noMore = ref(false);
        const spaces = ref<Space[]>([]);
        const errMsg = ref<string>("");
        const query = reactive<SpaceQuery>({offset: 0, limit: 50});

        const loadMore = (init = false) => {
            loadingMore.value = true;
            fetchSpaces(store, query).then(res => {
                res.forEach(s => {
                    spaces.value.push(s);
                });
                query.offset += res.length;
                if (res.length < query.limit) {
                    noMore.value = true;
                }
            }).catch(err => {
                errMsg.value = "Failed to fetch events from server, " + parseErrorMsg(err);
            }).finally(() => {
                loadingMore.value = false;
                if (init) {
                    initLoading.value = false;
                }
            });
        };

        onMounted(() => {
            loadMore(true);
        });

        const onJoin = (params: {id: string}) => {
            spaces.value.forEach(space => {
                if (space.id == params.id) {
                    space.isMember = true;
                }
            })
        };

        const onLeave = (params: {id: string}) => {
            spaces.value.forEach(space => {
                if (space.id == params.id) {
                    space.isMember = false;
                }
            })
        };

        const formatNumber = (n: number) => {
            if (n < 1000) {
                return n;
            } else if (n < 1000000) {
                return Math.floor(n / 1000) + "K";
            } else if (n < 1000000000) {
                return Math.floor(n / 1000000) + "M";
            }
        };

        return {
            initLoading,
            totalSpaces,
            loadMore,
            loadingMore,
            noMore,
            errMsg,
            spaces,
            onJoin,
            onLeave,
            formatNumber,
        };
    }
});
</script>

<style lang="less" scoped>
.spaces {
    width: 100%;
}

.space {
    margin: 10px;
}
</style>