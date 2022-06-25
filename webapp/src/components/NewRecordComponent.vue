<template>
    <div class="formContainer">
        <div class="formContent">
            <a-row>
                <a-typography-title :level="2">New Record</a-typography-title>
            </a-row>
            <a-row>
                <a-textarea
                    :rows="4"
                    @change="() => alert.description = ''"
                    v-model:value="description"
                    placeholder="Describe the record, append tags with # at the end"
                    style="font-size: large"
                />
            </a-row>
            <a-row v-if="!!alert.description" class="alertGap">
                <a-alert :message="alert.description" type="error" />
            </a-row>
            <a-row class="titleGap">
                <a-typography-title :level="3">Evidences</a-typography-title>
            </a-row>
            <a-row type="flex">
                <div>
                    <a-upload
                        name="evidence"
                        v-model:file-list="evidences"
                        list-type="picture-card"
                        @preview="handlePreview"
                        :customRequest="uploadCustomRequest"
                        :maxCount="5"
                        multiple
                        @change="() => alert.evidences = ''"
                    >
                        <div v-if="evidences.length < 5"> 
                            <upload-outlined />
                            <div style="margin-top: 8px">Upload Files</div>
                        </div>
                    </a-upload>
                </div>
                <div v-if="!!alert.evidences" class="alertGap">
                    <a-alert :message="alert.evidences" type="error" />
                </div>
            </a-row>

            <a-row class="titleGap">
                <a-typography-title :level="3">References</a-typography-title>
            </a-row>
            <a-row v-for="(reference, index) in references" v-bind:key="index">
                 <a-card style="width: 100%; margin-top: 10px;">
                    <a-row style="margin-bottom: 20px">
                        Created by {{reference!.creator.username || "Someone"}} {{formatDate(reference!.createdAt)}}
                    </a-row>
                    <a-row style="margin-bottom: 20px">
                        <span>{{reference!.description}}</span>
                    </a-row>
                    <a-row>
                        <Evidence
                            class="evidence" 
                            v-for="evidence in reference!.evidences"
                            v-bind:key="evidence.id"
                            :preview="true"
                            :evidence="evidence"
                        />
                    </a-row>
                </a-card>
            </a-row>
            <a-row style="margin-top: 10px;">
                <a-button type="dashed" size="large" @click="onShowCollections">
                    Select from collections
                </a-button>
            </a-row>
            <a-row class="titleGap" type="flex" style="justify-content: space-around;">
                <div v-if="!!alert.save" class="alertGap">
                    <a-alert :message="alert.save" type="error" />
                </div>
                <a-button type="primary" size="large" @click="onSaveRecord">
                    Save
                </a-button>
                <a-button type="primary" size="large" href="/">
                    Cancel
                </a-button>
            </a-row>
        </div>
        <a-modal
            :visible="showCollections"
            title="Select record to reference"
            @ok="onAddReference"
            @cancel="onCancelReference"
        >
            <div @scroll="onScroll" style="height: calc(50vh); overflow: auto; background-color: #ececec;">
                <a-card
                    :hoverable="reference.status !== 'selected'"
                    :class="reference.status || 'available'"
                    v-for="(reference, index) in collections"
                    v-bind:key="index"
                    @click="() => selectReference(reference)"
                >
                    <a-row style="margin-bottom: 20px">
                        Created by {{reference!.creator.username || "Someone"}} {{formatDate(reference!.createdAt)}}
                    </a-row>
                    <a-row style="margin-bottom: 20px">
                        <span>{{reference!.description}}</span>
                    </a-row>
                    <a-row>
                        <Evidence
                            class="evidence" 
                            v-for="evidence in reference!.evidences"
                            v-bind:key="evidence.id"
                            :preview="true"
                            :evidence="evidence"
                        />
                    </a-row>
                </a-card>
            </div>
        </a-modal>                          
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import router from '../router';
import { useStore } from '../store';
import { authenticate } from '../services/auth';
import { formatDate } from '@/lib/format';
import {
    RecordReference,
    NewRecordAlert,
    validateRecord,
    newRecord,
    fetchCollectedRecords,
} from '../services/record';
import { RawFile, uploadEvidence, getRawFile} from '../services/evidence';
import { genHash, parseErrorMsg } from '../services/utils';
import Evidence from '@/components/evidence/EvidenceComponent.vue'

export default defineComponent({
    components: {
        UploadOutlined,
        Evidence
    },
    setup() {
        const store = useStore();
        if (!authenticate(store)) return;
        if (!store.state.profile?.username) {
            router.push('init');
        }

        const alert = reactive<NewRecordAlert>({});
        const description = ref<string>("");
        const references = ref<RecordReference[]>([]);
        const evidences = ref<RawFile[]>([]);

        const collections = reactive<RecordReference[]>([]);
        const showCollections = ref<boolean>(false);
        const selectReference = (reference: RecordReference) => {
            if (reference.status == "selected") {
                reference.status = "available";
            } else {
                reference.status = "selected";
            }
        };
        const onAddReference = () => {
            showCollections.value = false;
            collections.forEach(ref => {
                if (ref.status == "selected") {
                    references.value.push(ref);
                    ref.status = "added";
                }
            });
        };
        const deleteReference = (reference: RecordReference, index: number) => {
            reference.status = "available";
            references.value.splice(index, 1);
        };
        const onCancelReference = () => {
            showCollections.value = false;
        };

        const handlePreview = async (file: any) => {
            window.open(file.url);
        };

        const onSaveRecord = async () => {
            const record = {
                description: description.value,
                evidences: evidences.value,
                references: references.value
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
            references,
            alert,
            collections,
            uploadCustomRequest,
            selectReference,
            onAddReference,
            onCancelReference,
            deleteReference,
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

.itemGap {
    margin-top: 20px;
}

.alertGap {
    margin-top: 5px;
}

.selected {
    border: 3px solid #fcba03;
    margin: 5px;
}

.available {
    margin: 5px;
}

.added {
    display: none;
}
</style>