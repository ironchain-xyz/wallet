<template>
    <a-row v-if="(link, index) in links" :key="index">
        <a-input
            v-model:value="links[index]"
            placeholder="Link"
        >    
        </a-input>
    </a-row>
    <a-button type="primary" @click="links.push('')">
        Add Link
    </a-button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    components: { },
    setup() {
        const links = ref<string[]>([]);
        return {
            links,
        };
    }
});
</script>