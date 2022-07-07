<template>
    <a-row align="middle" :gutter="20">
        <a-col v-for="evidence in evidences" v-bind:key="evidence.hash">
            <div class="imgContainer">
                <img
                    v-if="fileType(evidence) == 'image'"
                    :src="fileUrl(evidence)"
                    :alt="evidence.hash"
                    class="inside"
                />
                <video v-if="fileType(evidence) == 'video'" class="inside" controls>
                    <source :src="fileUrl(evidence)" type="video/mp4">
                </video>
            </div>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BASE_URL } from '@/lib/constants';
import { Evidence } from '@/services/evidence';
import { formatFileSize } from '@/lib/format';

export default defineComponent({
    props: {
        evidences: Object as () => Evidence[],
    },
    setup() {
        const fileUrl = (e: Evidence) => {
            return BASE_URL + "static/evidences/" + e.rawFile.hash;
        }

        const fileType = (e: Evidence) => {
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
    width: 100px;
    height: 100px;
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