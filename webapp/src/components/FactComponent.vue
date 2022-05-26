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
                    <a :href="fileUrl(evidence)" class="evidenceWrapper">
                        <img v-if="isImage(evidence)" :src="fileUrl(evidence)" :alt="evidence.hash"/>
                        <template v-if="!isImage(evidence)">
                            <div>
                                <div>
                                    <FileOutlined class="largeIcon" style="margin-top: 15px"/>
                                </div>
                                <div style="margin-top: 5px">{{calFileSize(evidence)}}</div>
                            </div>
                        </template>
                    </a>
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
import { FileOutlined } from '@ant-design/icons-vue';
import {File, Fact, fetchFacts, fetchEvidences} from '../services/fact';
import { shortDescription } from '../services/utils'
import { BASE_URL } from '@/lib/constants';

export default defineComponent({
    components: {FileOutlined},
    setup() {
        const store = useStore();
        if (!authenticate(store)) return;

        const route = useRoute();
        const description = ref<string>("");
        const references = ref<Fact[]>([]);
        const evidences = ref<File[]>([]);

        onMounted(async () => {
            const hash = route.params.hash as string;
            const facts = await fetchFacts(store, [hash]);
            if (facts.length == 0) {
                description.value = "Fact not found";
            } else {
                const fact = facts[0];
                description.value = fact.description;
                const [e, r] = await Promise.all([
                    fetchEvidences(store, fact.evidences as string[]),
                    fetchFacts(store, fact.references as string[])
                ]);
                evidences.value = e;
                references.value = r;
            }
        });

        const fileUrl = (file: File) => {
            return BASE_URL + "static/evidences/" + file.hash;
        }

        const isImage = (file: File) => {
            return file.mimetype == "image/png" ||
                file.mimetype == "image/jpeg" || 
                file.mimetype == "image/jpg";
        }

        const calFileSize = (file: File) => {
            if (!file.size) {
                return "Unknown Size"
            }
            if (file.size < 1024) {
                return file.size.toFixed(1) + "B";
            }
            if (file.size < 1024 * 1024) {
                return (file.size / 1024).toFixed(1).toString() + "KB";
            }
            if (file.size < 1024 * 1024 * 1024) {
                return (file.size / (1024 * 1024)).toFixed(1).toString() + "MB";
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
            isImage,
            calFileSize
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

.evidenceWrapper {
    width: 100px;
    height: 100px;
    border: 1px solid #ececec;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
}

img {
    width:100%;
    max-height: 100%;
}

.largeIcon {
    font-size: 32px;
}
</style>