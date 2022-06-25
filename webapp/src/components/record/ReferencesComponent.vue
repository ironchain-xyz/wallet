<template>
    <a-row v-for="reference in references" v-bind:key="reference.hash">
        <a-card style="width: 100%; margin-top: 10px;">
            <a-row style="margin-bottom: 20px">
                Created by {{reference.creator.username || "Someone"}} {{formatDate(reference!.createdAt)}}
            </a-row>
            <a-row style="margin-bottom: 20px">
                <a :href='"/record/" + reference.hash'>{{reference.description}}</a>
            </a-row>
            <a-row style="margin-bottom: 20px">
                <Evidences :evidences="reference.evidences" :thumbnail="true"/>
            </a-row>
            <a-row v-for="(refHash, index) in reference.referenceHashes" v-bind:key="refHash">
                Reference {{index + 1}}: 
                <a :href='"/record/" + hash'>{{refHash.substring(0, 10)}}</a>
            </a-row>
        </a-card>
    </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Record } from '@/services/record';
import { Evidence } from '@/services/evidence';
import { shortDescription } from '@/services/utils'
import { BASE_URL } from '@/lib/constants';
import Evidences from '@/components/record/EvidencesComponent.vue'
import { formatDate } from '@/lib/format';

export default defineComponent({
    components: { Evidences },
    props: {
        references: Object as () => Record[],
    },
    setup() {
        const fileUrl = (e: Evidence) => {
            return BASE_URL + "static/evidences/" + e.rawFile.hash;
        };

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

        const calFileSize = (e: Evidence) => {
            const size = e.rawFile.size;
            if (!size) {
                return "Unknown Size"
            }
            if (size < 1024) {
                return size.toFixed(1) + "B";
            }
            if (size < 1024 * 1024) {
                return (size / 1024).toFixed(1).toString() + "KB";
            }
            if (size < 1024 * 1024 * 1024) {
                return (size / (1024 * 1024)).toFixed(1).toString() + "MB";
            }
            return "> 1GB";
        }

        return {
            shortDescription,
            fileUrl,
            fileType,
            calFileSize,
            formatDate
        }
    }
});
</script>