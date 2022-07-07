<template>
    <a-row v-if="data" class="border" style="padding: 0px;">
        <a-typography-title strong :level="5" style="padding: 10px 15px; margin: 0px;">
            Description
        </a-typography-title>
        <a-divider style="margin: 0px;"></a-divider>
        <a-row style="padding: 15px; width: 100%;">
           {{ data.description }}
        </a-row>
    </a-row>
</template>

<script lang="ts">
import { Space } from '@/services/space';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        data: Object as () => Space,
    },
    setup() {
        return { };
    }
});
</script>