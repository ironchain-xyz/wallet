<template>
    <a-card class="container" v-if="isCollected">
        <a-row style="margin-bottom: 20px">
            <a-col :span="18" style="text-align: left">
                Created by {{record!.creator.username || "Someone"}} {{formatDate(record!.createdAt)}}
            </a-col>
            <a-col :span="6">
                <a-button type="text" @click="onCollect">
                    <template #icon>
                        <DeleteOutlined twoToneColor="#eb2f96"/>
                    </template>
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

import { Record, removeFromCollection } from '@/services/record';
import Evidence from '@/components/evidence/EvidenceComponent.vue'
import { DeleteOutlined } from '@ant-design/icons-vue';
import { formatDate } from '@/lib/format';

export default defineComponent({
    components: {Evidence, DeleteOutlined},
    props: {
        record: Object as () => Record
    },
    setup(props, { emit }) {
        const store = useStore();

        const recordUrl = computed(() => {
            return "/record/" + props.record.hash;
        });

        const onCollect = () => {
            removeFromCollection(store, props.record.hash).then(() => {
                emit("toggleCollection", {
                    action: "remove", 
                    record: props.record.hash,
                });
            });
        };

        const isCollected = computed(() => {
            const uid = store.state.user!.id!;
            return props.record.collectors.some(c => c.userId == uid);
        });

        return {
            formatDate,
            recordUrl,
            isCollected,
            onCollect,
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