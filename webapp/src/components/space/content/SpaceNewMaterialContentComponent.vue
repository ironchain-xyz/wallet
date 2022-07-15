<template>
    <a-row class="field">
        <a-textarea
            :rows="4"
            @change="() => alert.description = ''"
            v-model:value="material.description"
            placeholder="Describe the material, append tags with # at the end"
        />
    </a-row>
    <a-row class="field">
        <a-upload
            name="file"
            v-model:file-list="material.files"
            accept="image/png,image/jpeg,image/jpeg,image/gif,video/mp4"
            list-type="picture-card"
            @preview="handlePreview"
            :customRequest="uploadCustomRequest"
            :maxCount="20"
            multiple
        >
            <div v-if="material.files.length < 5"> 
                <upload-outlined />
                <div style="margin-top: 8px">Upload Evidences</div>
            </div>
        </a-upload>
    </a-row>
    <a-row v-if="!!alert" class="alertGap">
        <a-alert :message="alert" type="error" />
    </a-row> 
    <a-row class="field">
        <a-button type="primary" @click="onSaveMaterial">
            Publish
        </a-button>
    </a-row>                    
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import { useStore } from '@/store';
import { formatDate } from '@/lib/format';
import { NewMaterial, newMaterial } from '@/services/material';
import { upload, getRawFile} from '@/services/file';
import { genHash, parseErrorMsg } from '@/services/utils';
import { Space } from '@/services/space';

export default defineComponent({
    components: { UploadOutlined, },
    props: {
        data: Object as () => Space,
    },
    setup(props) {
        const store = useStore();
        const alert = ref<string>("");
        const material = ref<NewMaterial>({
            spaceId: props.data.id,
            description: "",
            files: [],
        });

        const handlePreview = async (file: any) => {
            window.open(file.url);
        };

        const onSaveMaterial = async () => {
            try {
                const res = await newMaterial(store, material.value);
                router.push("/material/" + res.hash);
            } catch (err) {
                alert.value = parseErrorMsg(err);
            }
        };

        const uploadCustomRequest = async (options: any) => {
            for (const file of material.value.files) {
                if (options.file.uid == file.uid) {
                    try {
                        const hash = await genHash(options.file);
                        const { exists } = await getRawFile(store, hash);
                        if (!exists) {
                            const uploaded = await upload(store, options.file);
                            if ("error" in uploaded) {
                                options.onError(
                                    new Error(uploaded.error), uploaded, options.file
                                );
                            } else {
                                options.onSuccess({
                                    name: options.file.name,
                                    mimeType: options.file.type,
                                    raw: uploaded.hash,
                                }, options.file);
                            }
                        } else {
                            options.onSuccess({
                                name: options.file.name,
                                mimeType: options.file.type,
                                raw: hash,
                            }, options.file);
                        }
                    } catch (err) {
                        options.onError(err, {}, options.file);
                    }
                }
            }
        };

        return {
            material,
            alert,
            uploadCustomRequest,
            onSaveMaterial,
            handlePreview,
            formatDate
        };
    }
});
</script>

<style lang="less" scoped>
.titleGap {
    margin-top: 40px;
}

.field {
    width: 100%;
    margin-top: 20px;
}
</style>