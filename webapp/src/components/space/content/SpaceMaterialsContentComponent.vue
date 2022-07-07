<template>
    <Materials :loadData="fetchCreatedMaterials">
        <template v-slot="{ data }">
            <Material :data="data" />
        </template>
    </Materials>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Material from '@/components/material/MaterialComponent.vue';
import Materials from '@/components/material/MaterialsComponent.vue';
import { fetchCreatedMaterials } from '@/services/material';

export default defineComponent({
    components: { Material, Materials },
    setup() {
        return {
            fetchCreatedMaterials
        };
    }
});
</script>

<style lang="less" scoped>
.materials {
    padding: 20px 10px;
}
</style>