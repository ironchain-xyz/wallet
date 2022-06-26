<template>
    <a-row class="container">
        <a-col :span="4">
            <a-avatar :size="50" class="avatar" shape="square">
                {{ record.creator.username.substring(0, 1).toUpperCase() }}
            </a-avatar>
            <a-row type="flex" justify="center">
                {{record.creator.username}}
            </a-row>
        </a-col>
        <a-col :span="20">
            <a-row justify="space-between">
                <a-col>
                    <a :href="recordUrl">
                        <span>{{record!.description}}</span>
                    </a>
                </a-col>
                <a-col>
                    <a-button type="text" @click="onCollect">
                        <template #icon>
                            <DeleteOutlined twoToneColor="#eb2f96"/>
                        </template>
                    </a-button>
                </a-col>
            </a-row>
            <a-row>
                <Evidences :evidences="record.evidences"/>
            </a-row>
            <References :references="record.references" />
            <a-row
                type="flex"
                justify="space-between"
                align="middle"
                style="margin-top: 5px; color: gray; font-size: 12px"
            >
                <a-col>
                    {{formatDate(record.createdAt)}}
                </a-col>
            </a-row>
        </a-col>
    </a-row>
    <a-divider class="container"></a-divider>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';

import { Record, removeFromCollection } from '@/services/record';
import Evidences from '@/components/record/EvidencesComponent.vue';
import References from '@/components/record/ReferencesComponent.vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { formatDate } from '@/lib/format';

export default defineComponent({
    components: {Evidences, References, DeleteOutlined},
    props: {
        record: Object as () => Record,
        index: Number,
    },
    setup(props, { emit }) {
        const store = useStore();

        const recordUrl = computed(() => {
            return "/record/" + props.record.hash;
        });

        const onCollect = () => {
            removeFromCollection(store, props.record.hash).then(() => {
                emit("toggleCollection", {
                    index: props.index,
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

.avatar {
    font-weight: bold;
    background-color: #209645;
}
</style>