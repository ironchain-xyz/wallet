<template>
    <a-list
        class="preview"
        :loading="initLoading"
        item-layout="vertical"
        size="large"
        :data-source="records"
    >
        <template #loadMore>
            <a-spin v-if="loadingMore" />
            <p v-if="noMore">No more records</p>
            <a-button v-if="!loadingMore && !noMore" @click="loadMore">loading more</a-button>
        </template>
        <template #renderItem="{ item }">
            <RecordComponent :record="item" :type="type" @toggleCollection="toggleCollection" />
        </template>
    </a-list>
    <a-row v-if="!!errMsg" style="margin-top: 100px;">
        <span>{{ errMsg }}</span>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { parseErrorMsg } from '@/services/utils';
import { useStore } from '@/store';
import RecordComponent from '@/components/record/RecordComponent.vue';
import {
    Record,
    RecordQuery,
    fetchCollectedRecords,
    fetchCreatedRecords,
    fetchLatestRecords,
    fetchRecord,
} from '@/services/record';

function fetchRecords(type, store, query) {
    if (type == "collected") {
        return fetchCollectedRecords(store, query);
    } else if (type == "created") {
        return fetchCreatedRecords(store, query);
    } else if (type == "explore") {
        return fetchLatestRecords(store, query);
    } else if (type == "single") {
        const route = useRoute();
        const hash = route.params.hash as string;
        return fetchRecord(store, hash).then(res => {
            return [res];
        });
    }
    return Promise.resolve([]);
}

export default defineComponent({
    components: { RecordComponent },
    props: {
        type: String,
    },
    setup(props) {
        const store = useStore();

        const initLoading = ref(true);
        const loadingMore = ref(false);
        const noMore = ref(false);
        const records = ref<Record[]>([]);
        const errMsg = ref<string>("");
        const query = reactive<RecordQuery>({offset: 0, limit: 4});
        
        const loadMore = (init = false) => {
            loadingMore.value = true;
            fetchRecords(props.type, store, query).then(res => {
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

        const toggleCollection = (params: {action: "enable" | "disable" | "remove", index: number}) => {
            const userId = store.state.user!.id!;
            if (params.action == "disable") {
                records.value[params.index].collectors = records.value[params.index].collectors.filter(
                    u => u.userId != userId
                );
            } else if (params.action == "enable") {
                records.value[params.index].collectors.push({userId});
            } else if (params.action == "remove") {
                records.value.splice(params.index, 1);
                if (records.value.length == 0) {
                    errMsg.value = "No Records"
                }
            }
        };

        return {
            initLoading,
            loadMore,
            loadingMore,
            noMore,
            errMsg,
            records,
            toggleCollection,
        };
    }
});
</script>

<style lang="less" scoped>
.preview {
    width: 100%;
}
</style>