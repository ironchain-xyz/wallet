<template>
    <SpaceBase>
        <template v-slot="{ space }">
            <SpaceNewMaterial :data="space"></SpaceNewMaterial>
        </template>
    </SpaceBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { authenticated } from '@/services/auth';
import { useStore } from '@/store';
import router from '@/router';
import SpaceBase from '@/components/space/SpaceBaseComponent.vue';
import SpaceNewMaterial from '@/components/space/content/SpaceNewMaterialContentComponent.vue';

export default defineComponent({
    components: { SpaceNewMaterial, SpaceBase },
    setup() {
        const store = useStore();
        if (!authenticated(store)) {
            router.push("/")
        }
        return { };
    }
});
</script>