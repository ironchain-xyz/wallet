<template>
    <a-list
        :loading="initLoading"
        item-layout="vertical"
        size="large"
        :data-source="materials"
    >
        <template #loadMore>
            <a-spin v-if="loadingMore" />
            <a-button v-if="!loadingMore && !noMore" @click="loadMore">loading more</a-button>
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
    <a-row v-if="!!alert" justify="center">
        <a-alert :message="alert" type="error"></a-alert>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { parseErrorMsg } from '@/services/utils';
import { Material, MaterialQuery } from '@/services/material';

export default defineComponent({
    props: {
        loadData: Function,
    },
    setup(props) {
        const initLoading = ref(true);
        const loadingMore = ref(false);
        const noMore = ref(false);

        const materials = ref<Material[]>([]);
        const alert = ref<string>("");
        const query = reactive<MaterialQuery>({});

        const loadMore = (init = false) => {
            alert.value = "",
            loadingMore.value = true;
            props.loadData(query).then(res => {
                const totalFetched = res.materials.length;
                if (totalFetched > 0) {
                    query.startId = res.materials[totalFetched - 1].id;
                }
                materials.value.push(...res.materials);
                if (totalFetched < res.limit) {
                    noMore.value = true;
                }
            }).catch(err => {
                alert.value = "Failed to fetch events from server, " + parseErrorMsg(err);
                noMore.value = true;
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
            alert,
            materials,
        };
    }
});
</script>