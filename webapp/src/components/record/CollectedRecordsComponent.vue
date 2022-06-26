<template>
    <a-row v-for="(record, index) in records" v-bind:key="record.hash" type="flex" justify="center" class="preview">
        <CollectedRecord :record="record" :index="index" @toggleCollection="toggleCollection"/>
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
import CollectedRecord from './CollectedRecordComponent.vue';

import { Record, RecordQuery, fetchCollectedRecords } from '@/services/record';

export default defineComponent({
    components: {CollectedRecord},
    setup() {
        const store = useStore();

        let loading = ref<boolean>(false);
        let records = ref<Record[]>([]);
        let errMsg = ref<string>("");
        const query = reactive<RecordQuery>({limit: 20, offset: 0});

        onBeforeMount(() => {
            records.value = [];
            loading.value = true;
            fetchCollectedRecords(store, query).then(res => {
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

        const toggleCollection = (params: {index: number}) => {
            records.value.splice(params.index, 1);
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
.preview {
    width: 100%;
    margin-top: 20px;
}
</style>