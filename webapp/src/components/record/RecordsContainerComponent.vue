<template>
    <div @scroll="onScroll" ref="recordsContainer">
        <a-row v-for="(record, index) in records" v-bind:key="record.hash" justify="center" class="preview">
            <RecordComponent :record="record" :index="index" :type="type" @toggleCollection="toggleCollection" />
        </a-row>
        <a-row v-if="!loaded && loading">
            <a-spin/>
        </a-row>
        <a-row v-if="!!errMsg" style="margin-top: 100px;">
            <span>{{ errMsg }}</span>
        </a-row>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onBeforeMount, onMounted, onUnmounted } from 'vue';
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

        const recordsContainer = ref<null | {getBoundingClientRect: () => {bottom: number}}>(null);
        let loaded = ref<boolean>(false);
        let loading = ref<boolean>(false);
        let records = ref<Record[]>([]);
        let errMsg = ref<string>("");
        const query = reactive<RecordQuery>({limit: 4});

        onBeforeMount(() => {
            records.value = [];
            loading.value = true;
            fetchRecords(props.type, store, query).then(res => {
                res.forEach(record => {
                    records.value.push(record);
                });
                if (res.length > 0) {
                    query.startAt = query.startAt || res[0].createdAt;
                }
                if (records.value.length == 0) {
                    errMsg.value = "No Records"
                }
            }).catch(err => {
                errMsg.value = "Failed to fetch events from server, " + parseErrorMsg(err);
            }).finally(() => {
                loading.value = false;
            });
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

        const handleScroll = () => {
            let element = recordsContainer.value;
            let bottom = Math.floor(
                element
                ? element.getBoundingClientRect().bottom - 1
                : window.innerHeight
            );
            if (!loaded.value && element && bottom < window.innerHeight) {
                loading.value = true;
                fetchRecords(props.type, store, query).then(res => {
                    res.forEach(record => {
                        records.value.push(record);
                    });
                    if (res.length > 0) {
                        let lastRecord = res[res.length - 1];
                        query.from = lastRecord.collectedAt || lastRecord.createdAt || query.from;
                    }
                    if (res.length == 0) {
                        loaded.value = true;
                    }
                }).catch(err => {
                    errMsg.value = "Failed to fetch more events from server, " + parseErrorMsg(err);
                }).finally(() => {
                    loading.value = false;
                });
            }
        };

        onMounted(() => {
            window.addEventListener("scroll", handleScroll)
        });

        onUnmounted(() => {
            window.removeEventListener("scroll", handleScroll)
        });

        return {
            loading,
            loaded,
            errMsg,
            records,
            toggleCollection,
            handleScroll,
            recordsContainer,
        };
    }
});
</script>

<style lang="less" scoped>
.preview {
    width: 100%;
    margin-bottom: 40px;
}
</style>