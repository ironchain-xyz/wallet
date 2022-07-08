<template>
    <a-list
        :loading="initLoading"
        item-layout="vertical"
        size="large"
        :data-source="materials"
    >
        <template #loadMore>
            <a-spin v-if="loadingMore" />
            <a-button v-if="!loadingMore && !noMore && !errMsg" @click="loadMore">loading more</a-button>
            <span v-if="!!errMsg">{{ errMsg }}</span>
        </template>
        <template #renderItem="{ item }">
            <a-list-item
                key="material.hash"
                class="border"
                style="margin-bottom: 20px;"
            >
                 <a :href='"/material/" + item.hash'>
                    <slot :data="item" style="padding: 20px;"></slot>
                 </a>
            </a-list-item>
        </template>
    </a-list>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { parseErrorMsg } from '@/services/utils';
import { useStore } from '@/store';
import { Material, MaterialQuery } from '@/services/material';

export default defineComponent({
    props: {
        loadData: Function,
    },
    setup(props) {
        const store = useStore();

        const initLoading = ref(true);
        const loadingMore = ref(false);
        const noMore = ref(false);
        const materials = ref<Material[]>([]);
        const errMsg = ref<string>("");
        const query = reactive<MaterialQuery>({offset: 0, limit: 50});

        const loadMore = (init = false) => {
            loadingMore.value = true;
            props.loadData(store, query).then(res => {
                let index = materials.value.length;
                res.forEach(material => {
                    material.index = index++;
                    materials.value.push(material);
                });
                if (res.length > 0) {
                    query.startAt = query.startAt || res[0].collectedAt || res[0].createdAt;
                }
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

        return {
            initLoading,
            loadMore,
            loadingMore,
            noMore,
            errMsg,
            materials,
        };
    }
});
</script>