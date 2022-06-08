<template>
    <a-card class="container">
        <a-row style="margin-bottom: 20px">
            <a-col :span="18" style="text-align: left">
                Created {{formatDate(record!.createdAt)}}
            </a-col>
            <a-col :span="6">
                <a-button type="text" @click="toggleCollection">
                    <template #icon>
                        <HeartOutlined v-if="!isCollected"/>
                        <HeartTwoTone twoToneColor="#eb2f96" v-if="isCollected"/>
                    </template>
                    {{record!.collectors.length}}
                </a-button>
            </a-col>
        </a-row>
        <a-row style="margin-bottom: 20px">
            <a :href="recordUrl">
                <span>{{record!.description}}</span>
            </a> 
        </a-row>
        <a-row>
            <Evidence
                class="evidence" 
                v-for="evidence in record!.evidences"
                v-bind:key="evidence.id"
                :preview="true"
                :evidence="evidence"
            ></Evidence>
        </a-row>
    </a-card>
</template>


<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '../../store';

import { Record, addToCollection, removeFromCollection } from '@/services/record';
import Evidence from '@/components/evidence/EvidenceComponent.vue'
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons-vue';
import { formatDate } from '@/lib/format';

export default defineComponent({
    components: {Evidence, HeartOutlined, HeartTwoTone},
    props: {
        record: Object as () => Record
    },
    setup(props, { emit }) {
        const store = useStore();
        const recordUrl = computed(() => {
            return "/record/" + props.record.hash;
        });

        const isCollected = computed(() => {
            const uid = store.state.user!.id!;
            return props.record.collectors.some(c => c.userId == uid);
        });

        const toggleCollection = () => {
            if (isCollected.value) {
                removeFromCollection(store, props.record.hash).then(() => {
                    emit("toggleCollection", {
                        action: "remove", 
                        record: props.record.hash,
                    });
                });
            } else {
                addToCollection(store, props.record.hash).then(() => {
                    emit("toggleCollection", {
                        action: "add",
                        record: props.record.hash
                    });
                });
            }
        };
        return {
            formatDate,
            recordUrl,
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