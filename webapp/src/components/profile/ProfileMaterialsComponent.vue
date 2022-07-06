<template>
    <ProfileBase>
        <Materials :loadData="fetchCreatedMaterials"/>
    </ProfileBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { fetchCreatedMaterials } from '@/services/material';
import Materials from '@/components/material/MaterialsComponent.vue';
import ProfileBase from '@/components/profile/ProfileBaseComponent.vue';

export default defineComponent({
    components: { Materials, ProfileBase },
    setup() {
        const store = useStore();
        const profile = store.state.profile;
        return {
            profile,
            fetchCreatedMaterials,
        };
    }
});
</script>