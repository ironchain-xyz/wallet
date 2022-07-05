<template>
    <ProfileBase>
        <ProfileAbout></ProfileAbout>
    </ProfileBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProfileAbout from '@/components/profile/content/ProfileAboutContentComponent.vue';
import ProfileBase from '@/components/profile/ProfileBaseComponent.vue';

export default defineComponent({
    components: { ProfileAbout, ProfileBase },
    setup() {
        return { };
    }
});
</script>