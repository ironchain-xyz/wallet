<template>
    <a-row class="field">
        <a-textarea
            :rows="4"
            @change="() => alert.description = ''"
            v-model:value="description"
            placeholder="Describe the record, append tags with # at the end"
        />
        <div v-if="!!alert.description" class="field">
            <a-alert :message="alert.description" type="error" />
        </div>
    </a-row>
    <a-row class="field">
        <div>
            <a-upload
                name="evidence"
                v-model:file-list="evidences"
                accept="image/png,image/jpeg,image/jpeg,image/gif,video/mp4"
                list-type="picture-card"
                @preview="handlePreview"
                :customRequest="uploadCustomRequest"
                :maxCount="20"
                multiple
                @change="() => alert.evidences = ''"
            >
                <div v-if="evidences.length < 5"> 
                    <upload-outlined />
                    <div style="margin-top: 8px">Upload Evidences</div>
                </div>
            </a-upload>
        </div>
        <div v-if="!!alert.evidences" class="alertGap">
            <a-alert :message="alert.evidences" type="error" />
        </div>
    </a-row>
    <a-row class="field" v-for="(reference, index) in references" v-bind:key="index">
            <a-card style="width: 100%; margin-top: 10px;">
            <a-row style="margin-bottom: 20px">
                Created by {{reference!.creator.username || "Someone"}} {{formatDate(reference!.createdAt)}}
            </a-row>
            <a-row style="margin-bottom: 20px">
                <span>{{reference!.description}}</span>
            </a-row>
            <a-row>
                <Evidences :evidence="reference!.evidences"/>
            </a-row>
        </a-card>
    </a-row>
    <a-row class="field">
        <a-button type="primary" @click="onSaveRecord">
            Publish
        </a-button>
        <div v-if="!!alert.save" class="alertGap">
            <a-alert :message="alert.save" type="error" />
        </div>
    </a-row>                    
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import { useStore } from '@/store';
import { authenticate } from '@/services/auth';
import { formatDate } from '@/lib/format';
import {
    Record,
    NewRecordAlert,
    validateRecord,
    newRecord,
    fetchCollectedRecords,
} from '@/services/record';
import { RawFile, uploadEvidence, getRawFile} from '@/services/evidence';
import { genHash, parseErrorMsg } from '@/services/utils';
import Evidences from '@/components/record/EvidencesComponent.vue'

export default defineComponent({
    components: {
        UploadOutlined,
        Evidences
    },
    setup() {
        const store = useStore();
        if (!authenticate(store)) return;
        if (!store.state.profile?.username) {
            router.push('init');
        }

        const alert = reactive<NewRecordAlert>({});
        const description = ref<string>("");
        const evidences = ref<RawFile[]>([]);

        const collections = reactive<Record[]>([]);
        const showCollections = ref<boolean>(false);

        const handlePreview = async (file: any) => {
            window.open(file.url);
        };

        const onSaveRecord = async () => {
            const record = {
                description: description.value,
                evidences: evidences.value,
            };
            const res = validateRecord(record, alert);
            if (res.ok) {
                try {
                    const res = await newRecord(store, record);
                    router.push("/record/" + res.hash);
                } catch (err) {
                    alert.save = parseErrorMsg(err);
                }
            }
        };
        const query = reactive<{
            startAt?: string,
            offset: number,
            limit: number,
        }>({offset: 0, limit: 20,});
        const loadMoreCollections = () => {
            fetchCollectedRecords(store, query).then(res => {
                if (res.length > 0) {
                    if (!query.startAt) {
                        query.startAt = res[0].collectedAt;
                    }
                    query.offset += res.length;
                }
                res.forEach(record => collections.push(record));
            });
        };
        const onShowCollections = () => {
            showCollections.value = true;
            if (collections.length == 0) {
                loadMoreCollections();
            }
        };
        const onScroll = ({ target: { scrollTop, clientHeight, scrollHeight }}) => {
            if (scrollTop + clientHeight >= scrollHeight) {
                loadMoreCollections()
            }
        };

        const uploadCustomRequest = async (options: any) => {
            for (const file of evidences.value) {
                if (options.file.uid == file.uid) {
                    try {
                        const hash = await genHash(options.file);
                        const { exists } = await getRawFile(store, hash);
                        if (!exists) {
                            const uploaded = await uploadEvidence(store, options.file);
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
            description,
            evidences,
            alert,
            collections,
            uploadCustomRequest,
            onSaveRecord,
            handlePreview,
            onShowCollections,
            showCollections,
            onScroll,
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