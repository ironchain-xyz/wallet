<template>
    <a-modal :visible="visible" :closable="false">
        <a-row justify="end">
            <a-button type="text" @click="onCancel">
                <template #icon>
                    <CloseOutlined class="site-form-item-icon" />
                </template>
            </a-button>
        </a-row>
        <a-row class="field">
            <a-textarea
                :rows="2"
                @change="() => alert.description = ''"
                v-model:value="material.description"
                placeholder="Description"
                style="margin-bottom: 20px;"
            />
            <SpaceAddFiles v-if="type == 'image'" accept='image/png,image/jpeg,image/jpeg,image/gif,video/mp4' maxCount="9" />
            <SpaceAddFiles v-if="type == 'video'" accept="video/mp4" maxCount="9" />
            <SpaceAddLinks v-if="type == 'link'" />
        </a-row>
        <a-row v-if="!!alert" class="alertGap">
            <a-alert :message="alert" type="error" />
        </a-row>
        <template #footer>
            <a-row justify="center">
                <a-button type="primary" @click="onSaveMaterial">Publish</a-button>
            </a-row>
        </template>
    </a-modal>           
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import { useStore } from '@/store';
import { formatDate } from '@/lib/format';
import { NewMaterial, newMaterial } from '@/services/material';
import { parseErrorMsg } from '@/services/utils';
import { Space } from '@/services/space';
import SpaceAddFiles from '@/components/space/newMaterial/SpaceAddFilesComponent.vue';
import SpaceAddLinks from '@/components/space/newMaterial/SpaceAddFilesComponent.vue';

export default defineComponent({
    components: { CloseOutlined, SpaceAddFiles, SpaceAddLinks },
    props: {
        data: Object as () => Space,
        type: String,
        visible: Boolean,
    },
    setup(props, { emit }) {
        const store = useStore();

        console.log(props.type);

        const alert = ref<string>("");
        const material = ref<NewMaterial>({
            spaceId: props.data.id,
            description: "",
            type: props.type,
            links: [],
        });

        const handlePreview = async (file: any) => {
            window.open(file.url);
        };

        const onCancel = () => {
            alert.value = '';
            material.value.description = '';
            material.value.links = [];
            emit('close');
        }

        const onSaveMaterial = async () => {
            try {
                const res = await newMaterial(store, material.value);
                emit('close');
                router.push("/material/" + res.hash);
            } catch (err) {
                alert.value = parseErrorMsg(err);
            }
        };

        return {
            material,
            alert,
            onSaveMaterial,
            handlePreview,
            formatDate,
            onCancel,
        };
    }
});
</script>

<style lang="less" scoped>
.alertGap {
    margin-top: 40px;
}

.field {
    margin-top: 20px;
    width: 100%;
}
</style>