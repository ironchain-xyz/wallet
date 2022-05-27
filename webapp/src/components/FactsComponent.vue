<template>
    <a-row justify="center">
        <a-button type="primary" size="large" href="/fact/new">
            Create your fact
        </a-button>
    </a-row>
    <a-row v-for="fact in facts" v-bind:key="fact.hash" style="margin-top: 20px;" justify="center">
        <a :href="factUrl(fact)">
            <FactPreview :fact="fact" />
        </a>
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
import { fetchCreatedFacts, Fact } from '@/services/fact';
import FactPreview from './fact/FactPreviewComponent.vue';

export default defineComponent({
    components: {FactPreview},
    setup() {
        const store = useStore();
        const creator = store.state.user!.email;
        let loading = ref<boolean>(false);
        let facts = ref<Fact[]>([]);
        let errMsg = ref<string>("");
        const evidencesLookup = reactive<{}>({});
        const referencesLookup = reactive<{}>({});

        onBeforeMount(() => {
            facts.value = [];
            loading.value = true;
            fetchCreatedFacts(store, creator).then(res => {
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
                    facts.value.push(fact);
                });
            }).catch(err => {
                errMsg.value = "Failed to fetch events from server, " + parseErrorMsg(err);
            }).finally(() => {
                loading.value = false;
            });
        });

        const factUrl = (fact) => {
            return "/fact/" + fact.hash;
        }
        return {
            loading,
            errMsg,
            facts,
            factUrl
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

a {
    width: calc(100% - 40px);
    max-width: 800px;
    margin-top: 20px;
}
</style>