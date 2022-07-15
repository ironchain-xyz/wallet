<template>
    <a-typography-title strong :level="4">
        Create New Space
    </a-typography-title>
    <a-row>
        <a-typography-title strong :level="5">
            Name
        </a-typography-title>
        <a-input
            v-model:value="space.name"
        />
    </a-row>
    <a-row style="margin-top: 20px;">
         <a-typography-title strong :level="5">
            Description
        </a-typography-title>
        <a-textarea
            :rows="4"
            v-model:value="space.description"
        />
    </a-row>
    <a-row v-if="!!alert" style="margin-top: 20px;">
        <a-alert :message="alert" type="error" />
    </a-row>
    <a-row style="margin-top: 20px;" justify="center">
        <a-button type="primary" @click="onSave">
            Create
        </a-button>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { SpaceBase, newSpace } from '@/services/space';
import { useStore } from '@/store';
import { parseErrorMsg } from '@/services/utils';
import { authenticated } from '@/services/auth';
import router from '@/router';

export default defineComponent({
    setup() {
        const store = useStore();
        const alert = ref<String>("");
        const space = ref<SpaceBase>({name: "", description: ""});

        const onSave = () => {
            newSpace(store, space.value).then(res => {
                router.push("/space/" + res.id);
            }).catch(err => alert.value = parseErrorMsg(err));
        };

        if (!authenticated(store)) {
            router.push("/")
        }

        return {
            alert,
            space,
            onSave,
        };
    }
});
</script>