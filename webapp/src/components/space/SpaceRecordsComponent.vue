<template>
    <a-row>
        <a-typography-title strong :level="4">
            Materials
        </a-typography-title>
    </a-row>
    <RecordsContainer :fetchRecords="fetchCreatedRecords"></RecordsContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RecordsContainer from '@/components/record/RecordsContainerComponent.vue';
import { fetchCreatedRecords } from '@/services/record';

export default defineComponent({
    components: { RecordsContainer },
    setup() {
        return {
            fetchCreatedRecords
        };
    }
});
</script>

<style lang="less" scoped>
.records {
    padding: 20px 10px;
}
</style>