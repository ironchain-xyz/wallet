<template>
    <a-row align="middle" :gutter="20">
        <a-col v-for="file in files" v-bind:key="file.hash">
            <div class="imgContainer">
                <img
                    v-if="fileType(file) == 'image'"
                    :src="fileUrl(file)"
                    :alt="file.hash"
                    class="inside"
                />
                <video v-if="fileType(file) == 'video'" class="inside" controls>
                    <source :src="fileUrl(file)" type="video/mp4">
                </video>
            </div>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BASE_URL } from '@/lib/constants';
import { File } from '@/services/file';
import { formatFileSize } from '@/lib/format';

export default defineComponent({
    props: {
        files: Object as () => File[],
    },
    setup() {
        const fileUrl = (e: File) => {
            return BASE_URL + "static/upload/" + e.rawFile.hash;
        }

        const fileType = (e: File) => {
            if (e.mimeType.startsWith("image/")) {
                return "image";
            } else if (e.mimeType == "video/mp4") {
                return "video";
            } else {
                return "file";
            }
        }

        return {
            fileUrl,
            formatFileSize,
            fileType,
        }
    }
});
</script>

<style lang="less" scoped>
.imgContainer {
    width: 130px;
    height: 130px;
    margin: 10px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.inside {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>