<template>
    <a-upload
        name="files"
        v-model:file-list="files"
        accept="accept"
        list-type="picture-card"
        @preview="handlePreview"
        :customRequest="uploadCustomRequest(files)"
        :maxCount="maxCount"
        multiple
    >
        <div v-if="files.length < maxCount">
            <PlusOutlined style="fontSize: 30px;"/>
        </div>
    </a-upload>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';
import { upload, getRawFile} from '@/services/file';
import { genHash } from '@/services/utils';

interface File {
    uid: string,
    name: string,
    type: string,
}

export default defineComponent({
    components: { PlusOutlined, },
    props: {
        accept: String,
        maxCount: Number,
    },
    setup() {
        const store = useStore();
        const files = ref<File[]>([]);

        const handlePreview = async (file: any) => {
            window.open(file.url);
        };

        const uploadCustomRequest = (files: File[]) => async (options: any) => {
            for (const file of files) {
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
            files,
            uploadCustomRequest,
            handlePreview,
        };
    }
});
</script>