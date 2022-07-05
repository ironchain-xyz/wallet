<template>
    <a-list
        :loading="initLoading"
        item-layout="vertical"
        size="large"
        :data-source="records"
    >
        <template #loadMore>
            <a-spin v-if="loadingMore" />
            <a-button v-if="!loadingMore && !noMore" @click="loadMore">loading more</a-button>
        </template>
        <template #renderItem="{ item }">
            <RecordComponent :record="item" style="padding: 20px;"/>
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
import RecordComponent from '@/components/record/RecordComponent.vue';
import { Record, RecordQuery } from '@/services/record';

export default defineComponent({
    components: { RecordComponent },
    props: {
        fetchRecords: Function,
    },
    setup(props) {
        const store = useStore();

        const initLoading = ref(true);
        const loadingMore = ref(false);
        const noMore = ref(false);
        const records = ref<Record[]>([]);
        const errMsg = ref<string>("");
        const query = reactive<RecordQuery>({offset: 0, limit: 50});

        const loadMore = (init = false) => {
            loadingMore.value = true;
            props.fetchRecords(store, query).then(res => {
                console.log(res);
                let index = records.value.length;
                res.forEach(record => {
                    record.index = index++;
                    records.value.push(record);
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
            records,
        };
    }
});
</script>