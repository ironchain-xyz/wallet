<template>
    <ProfileBase>
        <Materials :loadData="fetchCreatedMaterials">
            <template v-slot="{ data }">
                <Material :data="data" />
            </template>
        </Materials>
    </ProfileBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { fetchCreatedMaterials } from '@/services/material';
import Material from '@/components/material/MaterialComponent.vue';
import Materials from '@/components/material/MaterialsComponent.vue';
import ProfileBase from '@/components/profile/ProfileBaseComponent.vue';


export default defineComponent({
    components: { Materials, Material, ProfileBase },
    setup() {
        const store = useStore();
        const profile = store.state.user?.profile;
        return {
            profile,
            fetchCreatedMaterials,
        };
    }
});
</script>