<template>
    <a-row v-if="evidences.length > 0" class="evidenceWrapper" type="flex">
        <div v-for="evidence in evidences" v-bind:key="evidence.hash">
            <img
                v-if="fileType(evidence) == 'image'"
                :src="fileUrl(evidence)"
                :alt="evidence.hash"
                :class='thumbnail ? "thumbnail" : "origin"'
            />
            <video v-if="fileType(evidence) == 'video'" :class='thumbnail ? "thumbnail" : "origin"' controls>
                <source :src="fileUrl(evidence)" type="video/mp4">
            </video>
        </div>
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
        thumbnail: Boolean,
    },
    setup() {
        const fileUrl = (e: Evidence) => {
            return BASE_URL + "static/evidences/" + e.rawFile.hash;
        }

        const fileType = (e: Evidence) => {
            if (e.mimeType == "image/png" ||
                e.mimeType == "image/jpeg" || 
                e.mimeType == "image/jpg") {
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
.evidenceWrapper {
    border: 1px solid #ececec;
    align-items: center;
}

.thumbnail {
    max-height: 50px;
    max-width: 50px;
}

.origin {
    max-height: 200px;
    max-width: 200px;
}
</style>