<template>
    <div class="content">
        <a-row justify="center">
            <a-button type="primary" size="large" href="/">
                Home
            </a-button>
        </a-row>
        <a-row v-for="record in records" v-bind:key="record.hash" type="flex" justify="center" class="preview">
            <CollectedRecord :record="record" @toggleCollection="toggleCollection"/>
        </a-row>
        <a-row>
            <a-spin v-if="loading" />
        </a-row>
        <a-row v-if="!!errMsg" style="margin-top: 100px;">
            <span>{{ errMsg }}</span>
        </a-row>
    </div>
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
.content {
    min-width: 50%;
    padding-bottom: 200px;
}

.preview {
    width: 100%;
    margin-top: 20px;
}
</style>