<template>
    <SpaceBase>
        <template v-slot="{ space }">
            <SpaceAbout :space="space"></SpaceAbout>
        </template>
    </SpaceBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SpaceBase from '@/components/space/SpaceBaseComponent.vue';
import SpaceAbout from '@/components/space/content/SpaceAboutContentComponent.vue';

export default defineComponent({
    components: { SpaceAbout, SpaceBase },
    setup() {
        return { };
    }
});
</script>