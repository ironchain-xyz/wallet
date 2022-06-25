<template>
    <div class="formContainer">
        <div class="formContent">
            <a-row type="flex" justify="center" style="margin-bottom: 50px">
                <a-button type="primary" size="large" href="/">
                    Home
                </a-button>
            </a-row>     
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
            <a-row v-for="reference in references" v-bind:key="reference.hash">
                <a-card style="width: 100%; margin-top: 10px;">
                    <a-row style="margin-bottom: 20px">
                        Created by {{reference.creator.username || "Someone"}} {{formatDate(reference!.createdAt)}}
                    </a-row>
                    <a-row style="margin-bottom: 20px">
                        <a :href="recordUrl(reference.hash)">{{reference.description}}</a>
                    </a-row>
                    <a-row style="margin-bottom: 20px">
                        <EvidenceComponent
                            class="evidence" 
                            v-for="evidence in reference.evidences"
                            v-bind:key="evidence.id"
                            :preview="true"
                            :evidence="evidence"
                        />
                    </a-row>
                    <a-row v-for="(refHash, index) in reference.referenceHashes" v-bind:key="refHash">
                        Reference {{index + 1}}: 
                        <a :href="recordUrl(refHash)">{{refHash}}</a>
                    </a-row>
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
import { formatDate } from '@/lib/format';

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
                evidences.value = record.evidences || [];
                references.value = record.references || [];
            }
        });

        const fileUrl = (e: Evidence) => {
            return BASE_URL + "static/evidences/" + e.rawFile.hash;
        };

        const recordUrl = (hash: string) => {
            return  "/record/" + hash;
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

        return {
            route,
            description,
            references,
            evidences,
            shortDescription,
            fileUrl,
            recordUrl,
            fileType,
            calFileSize,
            formatDate
        }
    }
});
</script>

<style lang="less" scoped>
.formContainer {
    display: flex;
    justify-content: center;
    margin-top: 10%;
    margin-bottom: 10%;
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