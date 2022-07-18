<template>
    <a-button
        shape="round"
        :type="actionType"
        style="font-weight: bold;"
        @mouseover="mouseOver = true"
        @mouseleave="mouseOver = false"
        @click.stop="onClick"
    >
        {{ action }}
    </a-button>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { Space, subscribe, unsubscribe } from '@/services/space';
import { useStore } from '@/store';

export default defineComponent({
    props: {
        space: Object as () => Space,
    },
    setup(props) {
        const store = useStore();
        const subscribed = computed(() => store.state.subscription[props.id]);

        const mouseOver = ref<boolean>(false);
        const action = computed(() => {
            if (!subscribed.value) {
                return "subscribe";
            } else if (mouseOver.value) {
                return "unsubscribe";
            } else {
                return "subscribed";
            }
        });

        const actionType = computed(() => {
            return subscribed.value && mouseOver.value ? "danger" : "";
        });

        const onClick = () => {
            if (!subscribed.value) {
                subscribe(store, props.space.id).then(() => {
                    store.commit("subscribe", props.space);
                });
            } else {
                unsubscribe(store, props.space.id).then(() => {
                    store.commit("unsubscribe", props.space);
                });
            }
        };

        return {
            mouseOver,
            action,
            actionType,
            onClick,
        };
    }
});
</script>