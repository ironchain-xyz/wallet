<template>
    <SpaceBase>
        <template v-slot="{ space }">
            <NewRecord :space="space"></NewRecord>
        </template>
    </SpaceBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Space } from '@/services/space';
import SpaceBase from '@/components/space/SpaceBaseComponent.vue';
import NewRecord from '@/components/space/content/NewRecordComponent.vue';

export default defineComponent({
    components: { NewRecord, SpaceBase },
    props: {
        space: Object as () => Space,
    },
    setup() {
        return { };
    }
});
</script>