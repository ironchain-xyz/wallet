<template>
    <a-row class="border" v-if="data" :wrap="false" style="padding: 15px;">
        <a-col flex="50px">
            <a-avatar :size="50" class="avatar" shape="square">
                {{ data.creator.username.substring(0, 1).toUpperCase() }}
            </a-avatar>
        </a-col>
        <a-col flex="auto" style="margin-left: 20px;">
            <a-row>
                <a-typography>
                    <a-typography-title
                        :level="5"
                        style="text-align: left; margin: 0px"
                    >
                        {{data.creator.username}}
                    </a-typography-title>
                    <a-typography-paragraph
                        type="secondary"
                        style="font-size: 12px; text-align: left;"
                    >
                        {{formatDate(data.createdAt)}}
                    </a-typography-paragraph>
                </a-typography>
            </a-row>
            <a-row>
                <a-typography-text>
                    {{data.description}}
                </a-typography-text>
            </a-row>
            <Evidences v-if="data.evidences.length > 0" :evidences="data.evidences"/>
            <a-row>
                <a-button type="text" disabled style="padding: 0px;">
                    <template #icon>
                        <StarOutlined />
                    </template>
                    {{data.collectors.length}}
                </a-button>
            </a-row>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Material } from '@/services/material';
import Evidences from '@/components/material/EvidencesComponent.vue';
import { StarOutlined } from '@ant-design/icons-vue';
import { formatDate } from '@/lib/format';

export default defineComponent({
    components: {Evidences, StarOutlined},
    props: {
        data: Object as () => Material,
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