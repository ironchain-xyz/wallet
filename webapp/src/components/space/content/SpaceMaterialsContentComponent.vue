<template>
    <Materials :loadData="fetchSpaceMaterials(data.id)">
        <template v-slot="{ data }">
            <Material :data="data" />
        </template>
    </Materials>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Material from '@/components/material/MaterialComponent.vue';
import Materials from '@/components/material/MaterialsComponent.vue';
import { Space } from '@/services/space';
import { fetchSpaceMaterials } from '@/services/material';

export default defineComponent({
    components: { Material, Materials },
    props: {
        data: Object as () => Space,
    },
    setup() {
        return {
            fetchSpaceMaterials
        };
    }
});
</script>

<style lang="less" scoped>
.materials {
    padding: 20px 10px;
}
</style>