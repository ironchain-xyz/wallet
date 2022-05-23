<template>
    <div class="formContainer">
        <div class="formContent">
            <a-row>
                <a-typography-title :level="2">New Fact</a-typography-title>
            </a-row>
            <a-row>
                <a-textarea
                    :rows="2"
                    @change="() => alert.description = ''"
                    v-model:value="fact.description"
                    placeholder="Describe the fact"
                />
            </a-row>
            <a-row v-if="!!alert.description" class="alertGap">
                <a-alert :message="alert.description" type="error" />
            </a-row>
            <a-row class="itemGap">
                <div v-if="setTime">
                    <a-date-picker
                        v-model:value="fact.startTime"
                        placeholder="Start Date"
                        style="margin-right: 20px;"
                        @openChange="() => alert.time = ''"
                    />
                    <a-date-picker
                        v-model:value="fact.endTime"
                        placeholder="End Date"
                        style="margin-right: 20px;"
                        @openChange="() => alert.time = ''"
                    />
                    <a-tooltip title="delete">
                        <a-button @click="toggleTime">
                            <template #icon>
                                <DeleteOutlined />
                            </template>
                        </a-button>
                    </a-tooltip>
                </div>
                <div v-if="!setTime">
                    <a-button type="dashed" @click="toggleTime" style="margin-right: 20px">
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        {{ setTime ? "Remove Time" : "Add Time" }}
                    </a-button>
                </div>
            </a-row>
            <a-row v-if="!!alert.time"  class="alertGap">
                <a-alert :message="alert.time" type="error" />
            </a-row>

            <a-row class="titleGap">
                <a-typography-title :level="3">References</a-typography-title>
            </a-row>
            <a-row v-for="(reference, index) in fact.references" v-bind:key="index">
                <a-input-group compact style="margin-top: 20px; text-align: left">
                    <a-input
                        v-model:value="fact.references[index].link"
                        placeholder="Link"
                        style="width: 100%; margin-bottom: 3px;"
                        @change="() => alert.references[index] = ''"
                    />
                    <a-input
                        v-model:value="fact.references[index].description"
                        placeholder="Description"
                        style="width: calc(100% - 35px);margin-right: 2px;"
                    />
                    <a-tooltip title="delete">
                        <a-button @click="() => deleteReference(index)">
                            <template #icon>
                                <DeleteOutlined />
                            </template>
                        </a-button>
                    </a-tooltip>
                </a-input-group>
                <div v-if="!!alert.references[index]" class="alertGap">
                    <a-alert :message="alert.references[index]" type="error" />
                </div>
            </a-row>
            <a-row :class="fact.references.length > 0 ? 'itemGap' : ''">
                <a-button type="dashed" @click="() => addReference()" style="margin-right: 20px">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    Add reference
                </a-button>
            </a-row>

            <a-row class="titleGap">
                <a-typography-title :level="3">Evidences</a-typography-title>
            </a-row>
            <a-row v-for="(evidence, index) in fact.evidences" v-bind:key="index">
                <a-input-group compact style="margin-bottom: 5px">
                    <a-input v-model:value="evidence.description" placeholder="Description"
                        style="width: calc(100% - 35px); margin-right: 2px;" />
                    <a-tooltip title="delete">
                        <a-button @click="() => deleteEvidence(index)">
                            <template #icon>
                                <DeleteOutlined />
                            </template>
                        </a-button>
                    </a-tooltip>
                </a-input-group>
                <div>
                    <a-upload
                        name="evidence"
                        v-model:file-list="evidence.files" 
                        list-type="picture-card"
                        @preview="handlePreview"
                        :customRequest="uploadCustomRequest"
                        :maxCount="10"
                        @change="() => alert.evidences[index] = ''"
                    >
                        <div v-if="evidence.files.length < 10">
                            <upload-outlined />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                </div>
                <div v-if="!!alert.evidences[index]" class="alertGap">
                    <a-alert :message="alert.evidences[index]" type="error" />
                </div>
            </a-row>

            <a-row :class="fact.evidences.length > 0 ? 'itemGap' : ''">
                <a-button type="dashed" @click="() => addEvidence()" style="margin-right: 20px">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    Add evidence
                </a-button>
            </a-row>
            <a-row class="titleGap">
                <a-typography-title :level="3">Tags</a-typography-title>
            </a-row>
            <a-row>
                <a-select
                    v-model:value="fact.tags"
                    mode="tags" style="width: 100%; text-align: left;"
                    placeholder="Add tags"
                ></a-select>
            </a-row>
            <a-row class="titleGap" type="flex" style="justify-content: center;">
                <a-button type="primary" size="large" block @click="onSaveFact">
                    Save
                </a-button>
            </a-row>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import router from '../router';
import { useStore } from '../store';
import { authenticate } from '../services/auth';
import { NewFactAlert, FactBase, validateFact, saveFact, uploadEvidence } from '../services/fact';
import type { UploadProps } from 'ant-design-vue';

export default defineComponent({
    components: {
        DeleteOutlined,
        PlusOutlined,
        UploadOutlined
    },
    setup() {
        const store = useStore();
        if (!authenticate(store)) return;
        if (!store.state.profile?.username) {
            router.push('init');
        }

        const alert = reactive<NewFactAlert>({
            references: [],
            evidences: [],
        });
        const fact = reactive<FactBase>({
            description: '',
            references: [],
            evidences: [],
            tags: [],
        });
        const setTime = ref<boolean>(false);
        const addReference = () => {
            fact.references.push({ link: '' });
            alert.references.push('');
        };
        const addEvidence = () => {
            fact.evidences.push({ files: [] });
            alert.evidences.push('');
        };

        const deleteReference = (index) => {
            alert.references.splice(index, 1);
            fact.references.splice(index, 1);
        };
        const deleteEvidence = (index) => {
            alert.evidences.splice(index, 1);
            fact.evidences.splice(index, 1);
        };

        const handlePreview = async (file: UploadProps['fileList'][number]) => {
            window.open(file.url);
        };
        const onSaveFact = () => {
            const res = validateFact(fact, alert);
            if (res.ok) {
                saveFact(store, fact);
            }
        };
        const toggleTime = () => {
            if (setTime.value) {
                fact.startTime = undefined;
                fact.endTime = undefined;
                alert.time = undefined;
            }
            setTime.value = !setTime.value;
        };

        const uploadCustomRequest = (options: any) => {
            uploadEvidence(store, options.file).then(res => {
                options.onSuccess(res, options.file);
            }).catch(err => {
                console.log(err);
            })
        };
        return {
            fact,
            alert,
            uploadCustomRequest,
            setTime,
            addReference,
            addEvidence,
            deleteReference,
            deleteEvidence,
            onSaveFact,
            handlePreview,
            toggleTime,
        };
    }
});
</script>

<style lang="less" scoped>
.formContainer {
    display: flex;
    justify-content: center;
    align-items: center;
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
</style>