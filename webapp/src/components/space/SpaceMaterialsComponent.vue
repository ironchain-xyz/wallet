<template>
    <SpaceBase>
        <template v-slot="{ space }">
            <SpaceMaterials :data="space"></SpaceMaterials>
        </template>
    </SpaceBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SpaceBase from '@/components/space/SpaceBaseComponent.vue';
import SpaceMaterials from '@/components/space/content/SpaceMaterialsContentComponent.vue';

export default defineComponent({
    components: { SpaceMaterials, SpaceBase },
    setup() {
        return { };
    }
});
</script>