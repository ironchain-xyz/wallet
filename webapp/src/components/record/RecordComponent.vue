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
                    <a :href='"/record/" + record.hash'>
                        <span>{{record!.description}}</span>
                    </a> 
                </a-col>
                <a-col>
                    <a-button type="text" @click="onToggleCollection" style="padding: 0px;">
                        <template #icon>
                            <HeartOutlined v-if="!isCollected"/>
                            <HeartTwoTone twoToneColor="#eb2f96" v-if="isCollected"/>
                        </template>
                        {{record!.collectors.length}}
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
                style="margin-top: 10px; color: gray; font-size: 12px"
            >
                {{formatDate(record.createdAt)}}
            </a-row>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '../../store';

import { Record, addToCollection, removeFromCollection } from '@/services/record';
import Evidences from '@/components/record/EvidencesComponent.vue';
import References from '@/components/record/ReferencesComponent.vue';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons-vue';
import { formatDate } from '@/lib/format';

export default defineComponent({
    components: {Evidences, References, HeartOutlined, HeartTwoTone},
    props: {
        record: Object as () => Record,
        index: Number,
        type: String,
    },
    setup(props, { emit }) {
        const store = useStore();
        const isCollected = computed(() => {
            const uid = store.state.user!.id!;
            return props.record.collectors.some(c => c.userId == uid);
        });

        const onToggleCollection = () => {
            if (isCollected.value) {
                removeFromCollection(store, props.record.hash).then(() => {
                    emit("toggleCollection", {
                        action: props.type == "collected" ? "remove" : "disable", 
                        index: props.index,
                    });
                });
            } else {
                addToCollection(store, props.record.hash).then(() => {
                    emit("toggleCollection", {
                        action: "enable",
                        index: props.index,
                    });
                });
            }
        };

        return {
            formatDate,
            onToggleCollection,
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

.avatar {
    font-weight: bold;
    background-color: #209645;
}
</style>