<template>
    <a-row>
        <a-typography-title strong :level="4">
            Materials
        </a-typography-title>
    </a-row>
    <Materials :loadData="fetchCreatedMaterials"></Materials>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Materials from '@/components/material/MaterialsComponent.vue';
import { fetchCreatedMaterials } from '@/services/material';

export default defineComponent({
    components: { Materials },
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