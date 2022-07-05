<template>
    <ProfileBase>
        <RecordsContainer :fetchRecords="fetchCreatedRecords"/>
    </ProfileBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { fetchCreatedRecords } from '@/services/record';
import RecordsContainer from '@/components/record/RecordsContainerComponent.vue';
import ProfileBase from '@/components/profile/ProfileBaseComponent.vue';

export default defineComponent({
    components: { RecordsContainer, ProfileBase },
    setup() {
        const store = useStore();
        const profile = store.state.profile;
        return {
            profile,
            fetchCreatedRecords,
        };
    }
});
</script>