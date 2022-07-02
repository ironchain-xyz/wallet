<template>
    <a-list-item key="record?.hash" style="padding: 0px; margin-bottom: 20px;">
        <a-row class="container">
            <a-col>
                <a-avatar :size="50" class="avatar" shape="square">
                    {{ record!.creator.username.substring(0, 1).toUpperCase() }}
                </a-avatar>
            </a-col>
            <a-col flex="auto" style="margin-left: 20px; width: calc(100% - 75px)">
                <a-row>
                    <a :href='"/record/" + record!.hash'>
                        <a-typography>
                            <a-typography-title
                                :level="5"
                                style="text-align: left; margin: 0px"
                            >
                                {{record!.creator.username}}
                            </a-typography-title>
                            <a-typography-paragraph
                                type="secondary"
                                style="font-size: 12px;"
                            >
                                {{formatDate(record!.createdAt)}}
                            </a-typography-paragraph>
                        </a-typography>
                    </a>
                </a-row>
                <a-row>
                    <a-typography-text>
                        {{record!.description}}
                    </a-typography-text>
                </a-row>
                <Evidences v-if="record!.evidences.length > 0" :evidences="record!.evidences"/>
                <a-row>
                    <a-button type="text" @click="onToggleCollection" style="padding: 0px;">
                        <template #icon>
                            <StarOutlined v-if="!isCollected"/>
                            <StarTwoTone twoToneColor="blue" v-if="isCollected"/>
                        </template>
                        {{record!.collectors.length}}
                    </a-button>
                </a-row>
            </a-col>
        </a-row>
    </a-list-item>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '../../store';

import { Record, addToCollection, removeFromCollection } from '@/services/record';
import Evidences from '@/components/record/EvidencesComponent.vue';
import { StarOutlined, StarTwoTone } from '@ant-design/icons-vue';
import { formatDate } from '@/lib/format';

export default defineComponent({
    components: {Evidences, StarOutlined, StarTwoTone},
    props: {
        record: Object as () => Record,
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
                        index: props.record.index,
                    });
                });
            } else {
                addToCollection(store, props.record.hash).then(() => {
                    emit("toggleCollection", {
                        action: "enable",
                        index: props.record.index,
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
    width: 100%;
}

.avatar {
    font-weight: bold;
    background-color: #209645;
}
</style>