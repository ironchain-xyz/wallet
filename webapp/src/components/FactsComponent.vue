<template>
    <div>
        <a-button type="primary" size="large" href="/fact/new">
            Create your fact
        </a-button>
    </div>
    <div v-if="facts.length == 0 && !fetchErrMsg" style="margin-top: 100px;">
        <h1>IronchainDAO</h1>
        <h2>
            We persist reality.
        </h2>
    </div>
    <div v-if="facts.length > 0 || !!fetchErrMsg" style="margin-top: 50px;">
        <a-select v-model:value="sortedBy" :options="sortedByOptions"></a-select>
        <a-spin v-if="loading" />
        <div v-for="fact in facts" v-bind:key="fact.hash">
            {{ fact.description }}
        </div>
        <div v-if="!!fetchErrMsg" style="margin-top: 100px;">
            {{ fetchErrMsg }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount } from 'vue';
import type { SelectProps } from 'ant-design-vue';
import { parseErrorMsg } from '@/services/utils';
import { useStore } from '@/store';
import { fetchFacts, Fact } from '@/services/fact';

export default defineComponent({
    components: {},
    setup() {
        const store = useStore();
        const owner = store.state.user!.username!;
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
        let facts = ref<Fact[]>([]);
        let fetchErrMsg = ref<string>("");
        watch(sortedBy, () => {
            facts.value = [];
            loading.value = true;
            fetchFacts({ owner, sortedBy: sortedBy.value }).then(res => {
                facts.value = res
            }).catch(err => {
                fetchErrMsg.value = "Failed to fetch events from server, " + parseErrorMsg(err);
            }).finally(() => {
                loading.value = false;
            });
        });
        onBeforeMount(() => {
            facts.value = [];
            loading.value = true;
            fetchFacts({ owner, sortedBy: sortedBy.value }).then(res => {
                facts.value = res
            }).catch(err => {
                fetchErrMsg.value = "Failed to fetch events from server, " + parseErrorMsg(err);
            }).finally(() => {
                loading.value = false;
            });
        });
        return {
            loading,
            fetchErrMsg,
            facts,
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