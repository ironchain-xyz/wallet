<template>
    <div>
        <a-button type="primary" size="large" href="/event/new">
            Start to record
        </a-button>
    </div>
    <div v-if="events.length == 0 && !fetchErrMsg" style="margin-top: 100px;">
        <h1>IronchainDAO</h1>
        <h2>
            We persist reality.
        </h2>
    </div>
    <div v-if="events.length > 0 || !!fetchErrMsg"  style="margin-top: 50px;">
        <a-select v-model:value="sortedBy" :options="sortedByOptions"></a-select>
        <a-spin v-if="loading"/>
        <div v-for="event in events" v-bind:key="event.id">
            {{event.name}}
        </div>
        <div v-if="!!fetchErrMsg" style="margin-top: 100px;">
            {{fetchErrMsg}}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount } from 'vue';
import type { SelectProps } from 'ant-design-vue';
import { fetchEvents, Event } from '../services/event';
import { parseErrorMsg } from '@/services/utils';

export default defineComponent({
  components: {},
  setup() {
        const sortedByOptions = ref<SelectProps['options']>([
            {
                value: 'latest',
                label: 'Show latest',
            },
            {
                value: 'hottest',
                label: 'Show hottest',
            },
        ]);
        let sortedBy = ref<string>("latest");
        let loading = ref<boolean>(false);
        let events = ref<Event[]>([]);
        let fetchErrMsg = ref<string>("");
        watch(sortedBy, () => {
            events.value = [];
            loading.value = true;
            fetchEvents({sortedBy: sortedBy.value}).then(res => {
                events.value = res
            }).catch(err => {
                fetchErrMsg.value = "Failed to fetch events from server, " + parseErrorMsg(err);
            }).finally(() => {
                loading.value = false;
            });
        });
        onBeforeMount(() => {
            events.value = [];
            loading.value = true;
            fetchEvents({sortedBy: sortedBy.value}).then(res => {
                events.value = res
            }).catch(err => {
                fetchErrMsg.value = "Failed to fetch events from server, " + parseErrorMsg(err);
            }).finally(() => {
                loading.value = false;
            });
        });
        return {
            loading,
            fetchErrMsg,
            events,
            sortedBy,
            sortedByOptions,
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
</style>