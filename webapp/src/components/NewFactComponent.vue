<template>
    <div class="formContainer">
        <div class="formContent">
            <a-row>
                <a-typography-title :level="2">New Fact</a-typography-title>
            </a-row>
            <a-row>
                <a-textarea :rows="2" v-model:value="fact.description" placeholder="Describe the fact" />
                <a-alert v-if="alert.description" :message="alert.description" show-icon type="error" />
            </a-row>
            <a-row class="itemGap">
                <div v-if="setTime">
                    <a-date-picker v-model:value="fact.startTime" placeholder="Start" style="margin-right: 20px;" />
                    <a-date-picker v-model:value="fact.endTime" placeholder="End" style="margin-right: 20px;" />
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
            <a-row class="titleGap">
                <a-typography-title :level="3">References</a-typography-title>
            </a-row>
            <a-row v-for="(reference, index) in fact.references" v-bind:key="index">
                <a-input-group compact>
                    <a-input v-model:value="fact.references[index].link" placeholder="Link"
                        style="width: 100%; margin-bottom: 3px;" />
                    <a-input v-model:value="fact.references[index].description" placeholder="Description"
                        style="width: calc(100% - 35px); margin-right: 2px;" />
                    <a-tooltip title="delete">
                        <a-button @click="() => deleteReference(index)">
                            <template #icon>
                                <DeleteOutlined />
                            </template>
                        </a-button>
                    </a-tooltip>
                </a-input-group>
            </a-row>
            <a-row>
                <a-button type="dashed" @click="() => addReference()" style="margin-right: 20px">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    Add a reference
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
                <a-upload v-model:file-list="evidence.files" list-type="picture-card" @preview="handlePreview">
                    <div v-if="evidence.files.length < 10">
                        <upload-outlined />
                        <div style="margin-top: 8px">Upload</div>
                    </div>
                </a-upload>
            </a-row>
            <a-row>
                <a-button type="dashed" @click="() => addEvidence()" style="margin-right: 20px">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    Add a evidence
                </a-button>
            </a-row>
            <a-row class="titleGap">
                <a-typography-title :level="3">Tags</a-typography-title>
            </a-row>
            <a-row>
                <a-select v-model:value="fact.tags" mode="tags" style="width: 100%" placeholder="Add tags"></a-select>
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
import { UploadProps } from 'ant-design-vue';
import router from '../router';
import { useStore } from '../store';
import { authenticate } from '../services/auth';
import { FactBase, validateFact, saveFact } from '../services/fact';

export default defineComponent({
    components: { DeleteOutlined, PlusOutlined, UploadOutlined },
    setup() {
        const store = useStore();
        if (!authenticate(store)) return;
        if (!store.state.profile?.username) {
            router.push('init');
        }

        let alert = reactive<{
            description?: string;
        }>({});

        const fact = reactive<FactBase>({
            description: '',
            references: [],
            evidences: [],
            tags: [],
        });
        const setTime = ref<boolean>(false);
        const addReference = () => {
            fact.references.push({ link: '' });
        };
        const addEvidence = () => {
            fact.evidences.push({ files: [] });
        };

        const deleteReference = (index) => {
            fact.references.splice(index, 1);
        };
        const deleteEvidence = (index) => {
            fact.evidences.splice(index, 1);
        };

        const handlePreview = async (file: UploadProps['fileList'][number]) => {
            console.log(file);
            window.open(file.url);
        };
        const onSaveFact = () => {
            alert = {};
            const res = validateFact(fact);
            if (res.ok) {
                saveFact(fact);
            } else if (res.alert) {
                console.log(res.alert);
                alert = res.alert;
            }
        };
        const toggleTime = () => {
            if (setTime.value) {
                fact.startTime = undefined;
                fact.endTime = undefined;
            }
            setTime.value = !setTime.value;
        };
        return {
            fact,
            alert,
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
    margin-top: 50px;
}

.itemGap {
    margin-top: 20px;
}
</style>