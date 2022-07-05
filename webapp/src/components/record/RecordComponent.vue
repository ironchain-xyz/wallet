<template>
    <a-list-item class="border" key="record?.hash" style="padding: 0px; margin-bottom: 20px;">
        <a-row :wrap="false">
            <a-col flex="50px">
                <a-avatar :size="50" class="avatar" shape="square">
                    {{ record!.creator.username.substring(0, 1).toUpperCase() }}
                </a-avatar>
            </a-col>
            <a-col flex="auto" style="margin-left: 20px;">
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
                    <a-button type="text" disabled style="padding: 0px;">
                        <template #icon>
                            <StarOutlined />
                        </template>
                        {{record!.collectors.length}}
                    </a-button>
                </a-row>
            </a-col>
        </a-row>
    </a-list-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Record } from '@/services/record';
import Evidences from '@/components/record/EvidencesComponent.vue';
import { StarOutlined } from '@ant-design/icons-vue';
import { formatDate } from '@/lib/format';

export default defineComponent({
    components: {Evidences, StarOutlined},
    props: {
        record: Object as () => Record,
        type: String,
    },
    setup() {
        return {
            formatDate,
        };
    }
});
</script>

<style lang="less" scoped>
.avatar {
    font-weight: bold;
    background-color: #209645;
}
</style>