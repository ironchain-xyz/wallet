<template>
    <a-row justify="center" style="margin-bottom: 15px;">
        <span style="color: gray; font-size: 13px; font-weight: bold;">
            {{ formatNumber(total + delta) }} subscribers
        </span>
    </a-row>
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
import { useRoute } from 'vue-router';
import { useStore } from '@/store';
import { authenticated } from '@/services/auth';

export default defineComponent({
    props: {
        space: Object as () => Space,
    },
    setup(props) {
        const store = useStore();
        const subscribed = computed(() => {
            const subscription = store.state.user?.subscription || {};
            return subscription[props.space.id] !== undefined;
        });
        const total = computed(() => Number(props.space.totalSubscribers));
        const delta = ref<number>(0);
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

        const formatNumber = (n: number) => {
            if (n < 1000) {
                return n;
            } else if (n < 1000000) {
                return Math.floor(n / 1000) + "K";
            } else if (n < 1000000000) {
                return Math.floor(n / 1000000) + "M";
            }
        };

        const route = useRoute();
        const onClick = () => {
            if (!authenticated(store)) {
                store.commit("startLogin", route.path);
            } else if (!subscribed.value) {
                subscribe(store, props.space.id).then(() => {
                    store.commit("subscribe", props.space);
                    delta.value += 1;
                });
            } else {
                unsubscribe(store, props.space.id).then(() => {
                    store.commit("unsubscribe", props.space);
                    delta.value -= 1;
                });
            }
        };

        return {
            mouseOver,
            action,
            actionType,
            total,
            delta,
            onClick,
            formatNumber,
        };
    }
});
</script>