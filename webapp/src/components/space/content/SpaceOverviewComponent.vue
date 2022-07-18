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
        <SpaceSubscribe :space="space"/>
    </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Space } from '@/services/space';
import router from '@/router';
import SpaceSubscribe from '@/components/space/content/SpaceSubscribeButtonComponent.vue';

export default defineComponent({
    components: { SpaceSubscribe },
    props: {
        space: Object as () => Space,
    },
    setup(props) {
        const mouseOver = ref<boolean>(false);
        const onClickSpace = () => {
            router.push("/space/" + props.space.id);
        };

        return {
            mouseOver,
            onClickSpace,
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