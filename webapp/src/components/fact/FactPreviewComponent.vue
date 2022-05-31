<template>
    <a-card class="container">
        <a-row style="margin-bottom: 20px">
            <a-col :span="18" style="text-align: left">
                Created by {{fact.createdBy || "Someone"}} {{printDate(fact.createdAt)}}
            </a-col>
            <a-col :span="6">
                <a-button type="text" @click="toggleCollection">
                    <template #icon>
                        <HeartOutlined v-if="!isCollected"/>
                        <HeartTwoTone twoToneColor="#eb2f96" v-if="isCollected"/>
                    </template>
                    {{fact.collectors.length}}
                </a-button>
            </a-col>
        </a-row>
        <a-row style="margin-bottom: 20px">
            <a :href="factUrl">
                <span>{{fact.description}}</span>
            </a> 
        </a-row>
        <a-row>
            <Evidence
                class="evidence" 
                v-for="evidence in fact.evidences"
                v-bind:key="evidence.hash"
                :preview="true"
                :evidence="evidence"
            ></Evidence>
        </a-row>
    </a-card>
</template>


<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '../../store';

import { Fact, addToCollection, removeFromCollection } from '../../services/fact';
import Evidence from '../evidence/EvidenceComponent.vue'
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons-vue';

export default defineComponent({
    components: {Evidence, HeartOutlined, HeartTwoTone},
    props: {
        fact: Object as () => Fact
    },
    setup(props, { emit }) {
        const store = useStore();

        const printDate = (date: Date) => {
            date = new Date(date);
            const diff = Math.abs(Date.now() - date.valueOf());
            if (diff > 1000 * 60 * 60 * 24) {
                return "on " + date.toLocaleDateString("en-US");
            } else if (diff > 1000 * 60 * 60) {
                return Math.floor(diff / (1000 * 60 * 60)).toString() + " hours ago";
            } else if (diff > 1000 * 60) {
                return Math.floor(diff / (1000 * 60)).toString() + " minutes ago";
            } else if (diff > 1000) {
                return Math.floor(diff / 1000).toString() + " seconds ago";
            } else {
                return "Just now";
            }
        };

        const factUrl = computed(() => {
            return "/fact/" + props.fact.hash;
        });

        const isCollected = computed(() => {
            const username = store.state.profile!.username!;
            return props.fact.collectors.includes(username);
        });

        const toggleCollection = () => {
            if (isCollected.value) {
                removeFromCollection(store, props.fact.hash).then(() => {
                    emit("toggleCollection", {
                        action: "remove", 
                        fact: props.fact.hash,
                    });
                });
            } else {
                addToCollection(store, props.fact.hash).then(() => {
                    emit("toggleCollection", {
                        action: "add",
                        fact: props.fact.hash
                    });
                });
            }
        };
        return {
            printDate,
            factUrl,
            toggleCollection,
            isCollected,
        };
    }
});
</script>

<style lang="less" scoped>
.container {
    max-width: 800px;
    width: 100%;
}

.evidence {
    display: flex;
    width: 50px;
    min-height: 50px; 
}
</style>