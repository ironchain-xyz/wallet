<template>
    <a-row class="wrapper">
        <a-col>
            <a-affix :offset-top="top">
                <Navigation />
            </a-affix>
        </a-col>
        <a-col>
            <a-divider
                type="vertical"
                style="height: 100%; margin: 0px"
            />
        </a-col>
        <a-col flex="auto" style="width: calc(100% - 60px)">
            <a-row justify="center" align="middle" style="min-height: 50px; margin: 0px 30px;">
                <Header class="header"></Header>
            </a-row>
            <a-divider style="width: 100%; margin: 0px"></a-divider>
            <a-row justify="center" align="middle" style="margin-left: 10px; margin-top: 20px">
                <a-col class="content">
                    <slot></slot>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navigation from '@/components/NavigationComponent.vue';
import Header from '@/components/HeaderComponent.vue';
import { useStore } from '../store';
import { authenticate } from '../services/auth';

export default defineComponent({
  components: { Navigation, Header },
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

<style lang="less" scoped>
.wrapper {
    width: 100%;
}

.header {
    width: 100%;
    max-width: 700px
}

.content {
    margin-top: 20px;
    width: 100%;
    max-width: 700px
}
</style>