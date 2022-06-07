<template>
    <div class="formContainer">
        <div class="formContent">
            <a-row>
                <a-typography-title :level="3">Description</a-typography-title>
            </a-row>
            <a-row>
                <a-typography-text style="font-size: 20px;">{{description}}</a-typography-text>
            </a-row>
            <a-row v-if="evidences.length > 0" class="titleGap">
                <a-typography-title :level="3">Evidences</a-typography-title>
            </a-row>
            <a-row>
                <div v-for="(evidence, index) in evidences" v-bind:key="index">
                    <EvidenceComponent
                        :preview="false"
                        :evidence="evidence"
                        style="width: 200px; min-height: 200px;"
                    />
                </div>
            </a-row>
            <a-row  v-if="references.length > 0" class="titleGap">
                <a-typography-title :level="3">References</a-typography-title>
            </a-row>
            <a-row v-for="(reference, index) in references" v-bind:key="index">
                <a-card style="width: 100%; margin: 5px" :title="reference.hash">
                    <a-card-meta :description="shortDescription(reference.description)">
                        <template #avatar>
                            <a-avatar :src="reference.createdBy" />
                        </template>
                    </a-card-meta>
                </a-card>
            </a-row>                       
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'

import { useStore } from '../store';
import { authenticate } from '../services/auth';
import { RecordPreview, fetchRecord } from '../services/record';
import { Evidence } from '../services/evidence';
import { shortDescription } from '../services/utils'
import { BASE_URL } from '@/lib/constants';
import EvidenceComponent from './evidence/EvidenceComponent.vue';

export default defineComponent({
    components: { EvidenceComponent },
    props: {
        record: Object as () => Evidence,
    },
    setup() {
        const store = useStore();
        if (!authenticate(store)) return;

        const route = useRoute();
        const description = ref<string>("");
        const references = ref<RecordPreview[]>([]);
        const evidences = ref<Evidence[]>([]);

        onMounted(async () => {
            const hash = route.params.hash as string;
            const record = await fetchRecord(store, hash);
            if (!record) {
                description.value = "record not found";
            } else {
                description.value = record.description;
                evidences.value = record.evidences;
                references.value = record.references;
            }
        });

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

        const prettyPrintName = (e: Evidence) => {
            const len = e.name.length;
            let ext = e.name.split('.').pop();
            if (!ext || ext.length == len) {
                ext = "";
            }
            let filename = e.name.substring(0, len - ext.length - 1);
            if (filename.length > 10) {
                filename = filename.substring(0, 7);
                return filename + "..." + ext;
            } else {
                return filename + "." + ext;
            }
        }

        return {
            route,
            description,
            references,
            evidences,
            shortDescription,
            fileUrl,
            fileType,
            calFileSize,
            prettyPrintName
        }
    }
});
</script>

<style lang="less" scoped>
.formContainer {
    display: flex;
    justify-content: center;
    margin-top: 10%;
    height: 100%;
    width: 100%;
}

.formContent {
    min-width: 200px;
    max-width: 800px;
    width: 60%;
}

.titleGap {
    margin-top: 40px;
}
</style>