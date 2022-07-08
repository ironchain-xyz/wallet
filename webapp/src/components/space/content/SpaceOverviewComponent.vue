<template>
    <a-card
        v-if="space"
        class="space"
        @click="onClickSpace"
        @mouseover="mouseOver = true"
        @mouseleave="mouseOver = false"
        :class="{hover: mouseOver}"
    >
        <a-avatar :size="45" class="avatar" shape="square">
            {{ space.name.substring(0, 1).toUpperCase() }}
        </a-avatar>
        <h3>{{space.name}}</h3>
        <p style="font-size: 12px;">{{ formatNumber(space.totalMembers) }} members</p>
        <a-button
            shape="round"
            :type="actionType"
            style="font-weight: bold;"
            @click.stop="onClick"
        >
            {{ action }}
        </a-button>
    </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { Space, joinSpace, leaveSpace } from '@/services/space';
import { useStore } from '@/store';
import router from '@/router';

export default defineComponent({
    props: {
        space: Object as () => Space,
    },
    setup(props, { emit }) {
        const store = useStore();
        const mouseOver = ref<boolean>(false);
        const action = computed(() => {
            if (!props.space.isMember) {
                return "Join";
            } else if (mouseOver.value) {
                return "Leave";
            } else {
                return "Joined";
            }
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

        const actionType = computed(() => {
            if (props.space.isMember && mouseOver.value) {
                return "danger";
            }
            return "";
        });

        const onClick = () => {
            if (!props.space.isMember) {
                joinSpace(store, props.space.id).then(() => {
                    emit("onJoin", {id: props.space.id})
                });
            } else {
                leaveSpace(store, props.space.id).then(() => {
                    emit("onLeave", {id: props.space.id})
                });
            }
        };

        const onClickSpace = () => {
            router.push("/space/" + props.space.id);
        };

        return {
            mouseOver,
            action,
            actionType,
            onClickSpace,
            onClick,
            formatNumber,
        };
    }
});
</script>

<style lang="less" scoped>
.space {
    min-width: 140px;
    height: 190px;
    margin: 0px 10px 20px 10px;
}

.avatar {
    font-weight: bold;
    background-color: #209645;
}

.hover {
    border-style: solid;
    border-radius: 25px;
    border-color: gray;
}
</style>