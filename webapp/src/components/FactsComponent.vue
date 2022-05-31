<template>
    <a-row v-for="fact in facts" v-bind:key="fact.hash" justify="center" class="preview">
        <FactPreview :fact="fact" @toggleCollection="toggleCollection"/>
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
import { Fact } from '@/services/fact';
import { File } from '@/services/evidence';
import FactPreview from './fact/FactPreviewComponent.vue';
import { fetchCreatedFacts, fetchCollectedFacts } from '@/services/fact';
import { Store } from 'vuex';
import { State } from "../store";

async function fetchData(
    mode: string, store: Store<State>
) : Promise<{facts: Fact[], evidences: File[], references: Fact[]}>{
    if (mode == "created") {
        return await fetchCreatedFacts(store);
    }
    if (mode == "collected") {
        return await fetchCollectedFacts(store);
    }
    return {facts: [], evidences: [], references: []};
}

export default defineComponent({
    components: {FactPreview},
    props: {
        mode: String,
    },
    setup(props) {
        const store = useStore();
        let loading = ref<boolean>(false);
        let facts = ref<Fact[]>([]);
        let errMsg = ref<string>("");
        const evidencesLookup = reactive<{}>({});
        const referencesLookup = reactive<{}>({});
        onBeforeMount(() => {
            facts.value = [];
            loading.value = true;
            fetchData(props.mode, store).then(res => {
                for (const e of res.evidences) {
                    evidencesLookup[e.hash] = e;
                }
                for (const r of res.references) {
                    referencesLookup[r.hash] = r;
                }
                res.facts.forEach(fact => {
                    fact.evidences = fact.evidences.map(
                        e => evidencesLookup[e]
                    );
                    fact.references = fact.references.map(
                        r => referencesLookup[r]
                    );
                    fact.collectors = fact.collectors || [];
                    facts.value.push(fact);
                });
            }).catch(err => {
                errMsg.value = "Failed to fetch events from server, " + parseErrorMsg(err);
            }).finally(() => {
                loading.value = false;
            });
        });

        const toggleCollection = (params: {action: "remove" | "add", fact: string}) => {
            const username = store.state.profile!.username!;
            for (let i = 0; i < facts.value.length; i++) {
                if (facts.value[i].hash == params.fact) {
                    if (params.action == "remove") {
                        facts.value[i].collectors = facts.value[i].collectors.filter((user) => user != username);
                    } else if (params.action == "add") {
                        console.log(facts.value[i].collectors);
                        facts.value[i].collectors.push(username);
                        console.log(facts.value[i].collectors)
                    }
                }
            }
        };
        return {
            loading,
            errMsg,
            facts,
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