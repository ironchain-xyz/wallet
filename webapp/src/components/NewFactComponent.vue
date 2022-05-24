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
                    placeholder="Describe the fact, append tags with # at the end"
                />
            </a-row>
            <a-row v-if="!!alert.description" class="alertGap">
                <a-alert :message="alert.description" type="error" />
            </a-row>

            <a-row class="titleGap">
                <a-typography-title :level="3">When</a-typography-title>
            </a-row>
            <a-row>
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
                <a-typography-title :level="3">Evidences</a-typography-title>
            </a-row>
            <a-row type="flex">
                <div>
                    <a-upload
                        name="evidence"
                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                        v-model:file-list="fact.evidences"
                        list-type="picture-card"
                        @preview="handlePreview"
                        :customRequest="uploadCustomRequest"
                        :maxCount="10"
                        multiple
                        @change="() => alert.evidences = ''"
                    >
                        <div v-if="fact.evidences.length < 5"> 
                            <upload-outlined />
                            <div style="margin-top: 8px">Upload Files</div>
                        </div>
                    </a-upload>
                </div>
                <div v-if="!!alert.evidences" class="alertGap">
                    <a-alert :message="alert.evidences" type="error" />
                </div>
            </a-row>

            <a-row v-for="(reference, index) in fact.references" v-bind:key="index" style="margin-top: 10px;">
                <div style="width: 100%">
                    <a-input-search
                        v-model:value="reference.value"
                        @search="() => deleteReference(index)"
                    >
                        <template #addonBefore>
                            <a-select v-model:value="reference.header" style="width: 120px">
                                <a-select-option value="https://">https://</a-select-option>
                                <a-select-option value="http://">http://</a-select-option>
                                <a-select-option value="web3://">web3://</a-select-option>
                                <a-select-option value="ipfs://">ipfs://</a-select-option>
                                <a-select-option value="ipns://">ipns://</a-select-option>
                            </a-select>
                        </template>
                        <template #enterButton>
                            <DeleteOutlined />
                        </template>
                    </a-input-search>
                </div>
                
                <div v-if="!!alert.references[index]" class="alertGap">
                    <a-alert :message="alert.references[index]" type="error" />
                </div>
            </a-row>

            <a-row :class="fact.references.length > 0 ? 'itemGap' : ''">
                <a-button type="dashed" @click="() => addReference()">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    Add link
                </a-button>
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
        });
        const fact = reactive<FactBase>({
            description: '',
            references: [],
            evidences: [],
            tags: [],
        });
        const setTime = ref<boolean>(false);
        const addReference = () => {
            fact.references.push({header: 'https://', url: ""});
            alert.references.push('');
        };
        const deleteReference = (index) => {
            alert.references.splice(index, 1);
            fact.references.splice(index, 1);
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
            for (const file of fact.evidences) {
                if (options.file.uid == file.uid) {
                    console.log(options.file);
                    uploadEvidence(store, options.file).then(res => {
                        const uploaded = res.uploaded[0];
                        if (uploaded.hash) {
                            file.hash = uploaded.hash;
                            options.onSuccess(uploaded, options.file);
                        } else {
                            options.onError(
                                new Error(uploaded.message!), uploaded, options.file
                            );
                        }
                    }).catch(err => {
                        options.onError(err, {}, options.file);
                    })
                }
            }
        };
        return {
            fact,
            alert,
            uploadCustomRequest,
            setTime,
            addReference,
            deleteReference,
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
</style>