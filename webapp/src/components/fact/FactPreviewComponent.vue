<template>
    <a-card class="container">
        <a-row>
            <a-col :span="18" style="text-align: left">
                {{fact.description}}
            </a-col>
            <a-col :span="6" style="display: flex">
                <Evidence
                    class="evidence" 
                    v-for="evidence in fact.evidences"
                    v-bind:key="evidence.hash"
                    :preview="true"
                    :evidence="evidence"
                ></Evidence>
            </a-col>
        </a-row>
        <a-row>

        </a-row>
        <a-row>
            Created {{printDate(fact.createdAt)}}
        </a-row>
        <a-row v-if="!!fact.createdBy">
            Created by {{fact.createdBy}}
        </a-row>
    </a-card>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { Fact } from '../../services/fact';
import Evidence from '../evidence/EvidenceComponent.vue'

export default defineComponent({
    components: {Evidence},
    props: {
        fact: Fact,
    },
    setup() {
        const printDate = (date: Date) => {
            const diff = Math.abs(Date.now() - new Date(date).valueOf());
            if (diff > 1000 * 60 * 60 * 24) {
                return date.toLocaleDateString("en-US");
            } else if (diff > 1000 * 60 * 60) {
                return Math.floor(diff / (1000 * 60 * 60)).toString() + " hours ago";
            } else if (diff > 1000 * 60) {
                return Math.floor(diff / (1000 * 60)).toString() + " minutes ago";
            } else if (diff > 1000) {
                return Math.floor(diff / 1000).toString() + " seconds ago";
            } else {
                return "Just now";
            }
        }
        return {
            printDate
        };
    }
});
</script>

<style lang="less" scoped>
.container {
    max-width: 800px;
}

.evidence {
    display: flex;
    width: 50px;
    min-height: 50px; 
}
</style>