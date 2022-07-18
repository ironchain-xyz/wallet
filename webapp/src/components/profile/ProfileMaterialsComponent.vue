<template>
    <ProfileBase>
        <Materials :loadData="fetchUserMaterials(userId)">
            <template v-slot="{ data }">
                <Material :data="data" />
            </template>
        </Materials>
    </ProfileBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { fetchUserMaterials } from '@/services/material';
import { useStore } from '@/store';
import Material from '@/components/material/MaterialComponent.vue';
import Materials from '@/components/material/MaterialsComponent.vue';
import ProfileBase from '@/components/profile/ProfileBaseComponent.vue';

export default defineComponent({
    components: { Materials, Material, ProfileBase },
    setup() {
        const store = useStore();
        const userId = store.state.user?.id;
        return {
            userId,
            fetchUserMaterials,
        };
    }
});
</script>