<template>
    <a-row v-for="record in records" v-bind:key="record.hash" type="flex" justify="center" class="preview">
        <CreatedRecord v-if="mode == 'created'" :record="record" @toggleCollection="toggleCollection"/>
        <CollectedRecord v-if="mode == 'collected'" :record="record" @toggleCollection="toggleCollection"/>
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
import CreatedRecord from './record/CreatedRecordComponent.vue';
import CollectedRecord from './record/CollectedRecordComponent.vue';

import { Record, RecordQuery, fetchCreatedRecords, fetchCollectedRecords } from '@/services/record';
import { Store } from 'vuex';
import { State } from "../store";

async function fetchMoreRecords(
    mode: string,
    store: Store<State>,
    query: RecordQuery
) : Promise<Record[]>{
    if (mode == "created") {
        return await fetchCreatedRecords(store, query)
    }
    if (mode == "collected") {
        return await fetchCollectedRecords(store, query);
    }
    return [];
}

export default defineComponent({
    components: {CreatedRecord, CollectedRecord},
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
                res.forEach(record => {
                    records.value.push(record);
                });
                query.limit += res.length;
                if (res.length > 0) {
                    query.startAt = query.startAt || res[0].createdAt;
                }
            }).catch(err => {
                errMsg.value = "Failed to fetch events from server, " + parseErrorMsg(err);
            }).finally(() => {
                loading.value = false;
            });
        });

        const toggleCollection = (params: {action: "remove" | "add", record: string}) => {
            const userId = store.state.user!.id!;
            for (let i = 0; i < records.value.length; i++) {
                if (records.value[i].hash == params.record) {
                    if (params.action == "remove") {
                        records.value[i].collectors = records.value[i].collectors.filter(
                            u => u.userId != userId
                        );
                    } else if (params.action == "add") {
                        records.value[i].collectors.push({userId});
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