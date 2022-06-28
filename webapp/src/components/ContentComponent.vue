<template>
    <a-row class="content">
        <a-col>
            <Navigation />
        </a-col>
        <a-col style="margin-left: 20px">
            <slot></slot>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navigation from '@/components/NavigationComponent.vue'
import { useStore } from '../store';
import { authenticate } from '../services/auth';

export default defineComponent({
  components: { Navigation },
  setup() {
    const store = useStore();
    const authenticated = ref<boolean>(false);
    if (!authenticate(store)) {
        return;
    } else {
        authenticated.value = true;
    }

    return {
        authenticated,
    };
  },
})
</script>