<template>
    <a-row>
        <a-typography-title strong :level="4">
            About
        </a-typography-title>
    </a-row>
    <a-row class="border">
        <a-typography-text>
            {{space?.description}}
        </a-typography-text>
    </a-row>
</template>

<script lang="ts">
import { Space } from '@/services/space';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        space: Object as () => Space,
    },
    setup() {
        return { };
    }
});
</script>