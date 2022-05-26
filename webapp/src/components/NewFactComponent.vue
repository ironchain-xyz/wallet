<template>
    <div class="formContainer">
        <div class="formContent">
            <a-row>
                <a-typography-title :level="2">New Fact</a-typography-title>
            </a-row>
            <a-row>
                <a-textarea
                    :rows="4"
                    @change="() => alert.description = ''"
                    v-model:value="description"
                    placeholder="Describe the fact, append tags with # at the end"
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
                <a-card style="width: 100%; margin: 5px" :title="reference.hash">
                    <a-card-meta :description="reference.description">
                        <template #avatar>
                            <a-avatar :src="reference.createdBy" />
                        </template>
                    </a-card-meta>
                    <template #extra>
                        <a-button @click="() => deleteReference(reference, index)">Delete</a-button>
                    </template>
                </a-card>
            </a-row>
            <a-row style="margin-top: 10px;">
                <a-button type="dashed" size="large" @click="onShowLibrary">
                    Select from library
                </a-button>
            </a-row>
            <a-modal
                :visible="showLibrary"
                title="Select fact to reference"
                @ok="onAddReference"
                @cancel="onCancelReference"
            >
                <div @scroll="onScroll" style="height: calc(50vh); overflow: auto; background-color: #ececec;">
                    <a-card
                        :hoverable="reference.status !== 'selected'"
                        :class="reference.status || 'available'"
                        v-for="(reference, index) in library"
                        v-bind:key="index"
                        @click="() => selectReference(reference)"
                    >
                        <a-card-meta :description="reference.shortDescription">
                            <template #avatar>
                                <a-avatar :src="reference.createdBy" />
                            </template>
                        </a-card-meta>
                    </a-card>
                </div>
            </a-modal>                          

            <a-row class="titleGap" type="flex" style="justify-content: center;">
                <div v-if="!!alert.save" class="alertGap">
                    <a-alert :message="alert.save" type="error" />
                </div>
                <a-button type="primary" size="large" block @click="onSaveFact">
                    Save
                </a-button>
            </a-row>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import router from '../router';
import { useStore } from '../store';
import { authenticate } from '../services/auth';
import {
    RawFile,
    FactPreview,
    NewFactAlert,
    validateFact,
    saveFact,
    uploadEvidence,
    fetchEvidences,
    getLibraryMock
} from '../services/fact';
import { genHash, parseErrorMsg } from '../services/utils'
import type { UploadProps } from 'ant-design-vue';

function shortDescription(description: string) : string {
    if (description.length > 100) {
        return description.substring(0, 100) + "...";
    }
    return description;
}

export default defineComponent({
    components: {
        UploadOutlined,
    },
    setup() {
        const store = useStore();
        if (!authenticate(store)) return;
        if (!store.state.profile?.username) {
            router.push('init');
        }

        const alert = reactive<NewFactAlert>({});
        const description = ref<string>("");
        const references = ref<FactPreview[]>([]);
        const evidences = ref<RawFile[]>([]);

        const library = reactive<FactPreview[]>([]);
        const showLibrary = ref<boolean>(false);
        const offset = ref<number>(0);
        const selectReference = (reference) => {
            if (reference.status == "selected") {
                reference.status = "available";
            } else {
                reference.status = "selected";
            }
        };
        const onAddReference = () => {
            showLibrary.value = false;
            library.forEach(ref => {
                if (ref.status == "selected") {
                    references.value.push(ref);
                    ref.status = "added";
                }
            });
        };
        const deleteReference = (reference, index) => {
            reference.status = "available";
            references.value.splice(index, 1);
        };
        const onCancelReference = () => {
            showLibrary.value = false;
        };

        const handlePreview = async (file: UploadProps['fileList'][number]) => {
            window.open(file.url);
        };

        const onSaveFact = async () => {
            console.log(evidences.value);
            const fact = {
                description: description.value,
                evidences: evidences.value,
                references: references.value
            };
            const res = validateFact(fact, alert);
            if (res.ok) {
                try {
                    const res = await saveFact(store, fact);
                    if ("error" in res) {
                        alert.save = res.error;
                    } else {
                        router.push("/fact/" + res.hash);
                    }
                } catch (err) {
                    alert.save = parseErrorMsg(err);
                }
            }
        };
        const loadMoreFacts = () => {
            getLibraryMock(offset.value, 20).then((facts) => {
                offset.value += facts.length;
                facts.forEach(fact => {
                    const processed = {
                        ...fact,
                        shortDescription: shortDescription(fact.description)
                    }
                    library.push(processed);
                });
            }).catch(err => {
                console.log(`Failed to search facts with error ${err}`);
            });
        };
        const onShowLibrary = () => {
            showLibrary.value = true;
            if (library.length == 0) {
                loadMoreFacts();
            }
        };
        const onScroll = ({ target: { scrollTop, clientHeight, scrollHeight }}) => {
            if (scrollTop + clientHeight >= scrollHeight) {
                loadMoreFacts()
            }
        };

        const uploadCustomRequest = async (options: any) => {
            for (const file of evidences.value) {
                if (options.file.uid == file.uid) {
                    try {
                        const hash = await genHash(options.file);
                        const results = await fetchEvidences(store, [hash]);
                        if (results.length == 0) {
                            const uploaded = await uploadEvidence(store, options.file);
                            if ("error" in uploaded) {
                                options.onError(
                                    new Error(uploaded.error), uploaded, options.file
                                );
                            } else {
                                options.onSuccess(uploaded, options.file);
                            }
                        } else {
                            options.onSuccess(results[0], options.file);
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
            library,
            uploadCustomRequest,
            selectReference,
            onAddReference,
            onCancelReference,
            deleteReference,
            onSaveFact,
            handlePreview,
            onShowLibrary,
            showLibrary,
            onScroll,
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