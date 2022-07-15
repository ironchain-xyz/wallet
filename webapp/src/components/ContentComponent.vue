<template>
    <a-row>
        <Login></Login>
    </a-row>
    <a-row class="wrapper">
        <a-col>
            <a-affix :offset-top="top">
                <Navigation />
            </a-affix>
        </a-col>
        <a-divider
            type="vertical"
            style="height: 100%; margin: 0px"
        />
        <a-col flex="auto" style="width: calc(100% - 60px)">
            <a-row justify="center" align="middle" style="min-height: 50px; margin: 0px 20px;">
                <Header></Header>
            </a-row>
            <a-divider style="width: 100%; margin: 0px"></a-divider>
            <a-row justify="center">
                <a-col class="content">
                    <slot></slot>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navigation from '@/components/NavigationComponent.vue';
import Header from '@/components/HeaderComponent.vue';
import Login from '@/components/LoginComponent.vue';

export default defineComponent({
  components: { Navigation, Header, Login },
  setup() {
    return { };
  },
})
</script>

<style lang="less" scoped>
.wrapper {
    width: 100%;
}

.content {
    margin-top: 10px;
    width: 100%;
    max-width: 700px
}
</style>