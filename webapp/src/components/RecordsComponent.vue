<template>
    <a-row v-for="record in records" v-bind:key="record.hash" type="flex" justify="center" class="preview">
        <RecordPreview :record="record" @toggleCollection="toggleCollection"/>
    </a-row>
    <a-row>
        <a-spin v-if="loading" />
    </a-row>
    <a-row v-if="!!errMsg" style="margin-top: 100px;">
        <span>{{ errMsg }}</span>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onBeforeMount } from 'vue';
import { parseErrorMsg } from '@/services/utils';
import { useStore } from '@/store';
import RecordPreview from './record/RecordPreviewComponent.vue';
import { Record, RecordQuery, fetchCreatedRecords, fetchCollectedRecords } from '@/services/record';
import { Store } from 'vuex';
import { State } from "../store";

async function fetchMoreRecords(
    mode: string,
    store: Store<State>,
    query: RecordQuery
) : Promise<{records: Record[]}>{
    if (mode == "created") {
        return await fetchCreatedRecords(store, query);
    }
    if (mode == "collected") {
        return await fetchCollectedRecords(store, query);
    }
    return {records: []};
}

export default defineComponent({
    components: {RecordPreview},
    props: {
        mode: String,
    },
    setup(props) {
        const store = useStore();

        let loading = ref<boolean>(false);
        let records = ref<Record[]>([]);
        let errMsg = ref<string>("");
        const query = reactive<RecordQuery>({limit: 20, offset: 0});

        onBeforeMount(() => {
            records.value = [];
            loading.value = true;
            fetchMoreRecords(props.mode, store, query).then(res => {
                query.limit += res.records.length;
                if (res.records.length > 0) {
                    query.startAt = query.startAt || res.records[0].createdAt;
                }
                res.records.forEach(record => {
                    records.value.push(record);
                });
            }).catch(err => {
                errMsg.value = "Failed to fetch events from server, " + parseErrorMsg(err);
            }).finally(() => {
                loading.value = false;
            });
        });

        const toggleCollection = (params: {action: "remove" | "add", record: string}) => {
            const username = store.state.profile!.username!;
            for (let i = 0; i < records.value.length; i++) {
                if (records.value[i].hash == params.record) {
                    if (params.action == "remove") {
                        records.value[i].collectors = records.value[i].collectors.filter((user) => user != username);
                    } else if (params.action == "add") {
                        records.value[i].collectors.push(username);
                    }
                }
            }
        };
        return {
            loading,
            errMsg,
            records,
            toggleCollection,
        };
    }
});
</script>

<style lang="less" scoped>
h1 {
    color: @heading-color;
}

h2 {
    color: @text-color;
}

.preview {
    width: 100%;
    margin-top: 20px;
}
</style>