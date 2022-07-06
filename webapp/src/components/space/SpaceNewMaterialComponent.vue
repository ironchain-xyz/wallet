<template>
    <SpaceBase>
        <template v-slot="{ space }">
            <SpaceNewMaterial :data="space"></SpaceNewMaterial>
        </template>
    </SpaceBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SpaceBase from '@/components/space/SpaceBaseComponent.vue';
import SpaceNewMaterial from '@/components/space/content/SpaceNewMaterialContentComponent.vue';

export default defineComponent({
    components: { SpaceNewMaterial, SpaceBase },
    setup() {
        return { };
    }
});
</script>