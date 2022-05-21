<template>
    <a-modal
        :visible="editingFact"
        ok-text="Add"
        cancel-text="Cancel"
        :closable="false"
        :maskClosable="false"
        @ok="onSave"
        @cancel="onCancel"
        style="max-width: 1200px"
    >
        <a-typography-title :level="3" class="itemGap">New Fact</a-typography-title>
        <a-textarea :rows="2" v-model:value="fact.statement" placeholder="Describe the fact"/>
        <a-typography-title :level="5" class="itemGap">References</a-typography-title>
        <div v-if="fact.references.length == 0">
            <p>No Reference</p>
        </div>
        <div v-for="(reference, index) in fact.references" v-bind:key="index" class="itemGap">
            <a-input-group compact>
                <a-input
                    v-model:value="fact.references[index].description"
                    placeholder="Description"
                    style="width: calc(100% - 32px)"
                />
                <a-tooltip title="delete">
                    <a-button @click="() => deleteReference(index)">
                        <template #icon><DeleteOutlined /></template>
                    </a-button>
                </a-tooltip>
                <a-input
                    v-model:value="fact.references[index].value"
                    placeholder="Link"
                    style="width: 100%; margin-top: 5px;"
                />
            </a-input-group>
        </div>
        <div class="itemGap">
            <a-button type="primary" @click="() => addReference()" style="margin-right: 20px">
                <template #icon><PlusOutlined /></template>
                Add a reference
            </a-button>
        </div>
        <a-typography-title :level="5" class="itemGap">Evidences</a-typography-title>
        <div v-if="fact.evidences.length == 0">
            <p>No Evidence</p>
        </div>
        <div v-for="(evidence, index) in fact.evidences" v-bind:key="index" class="itemGap">
            <a-input-group compact style="margin-bottom: 5px">
                <a-input
                    v-model:value="fact.evidences[index].description"
                    placeholder="Description"
                    style="width: calc(100% - 32px)"
                />
                <a-tooltip title="delete">
                    <a-button @click="() => deleteEvidence(index)">
                        <template #icon><DeleteOutlined /></template>
                    </a-button>
                </a-tooltip>
            </a-input-group>
            <a-upload
                v-model:file-list="evidence.imgs"
                list-type="picture-card"
                @preview="handlePreview"
            >
                <div v-if="evidence.imgs.length < 10">
                    <upload-outlined />
                    <div style="margin-top: 8px">Upload</div>
                </div>
            </a-upload>
        </div>
        <div class="itemGap">
            <a-button type="primary" @click="() => addEvidence()" style="margin-right: 20px">
                <template #icon><PlusOutlined /></template>
                Add a evidence
            </a-button>
        </div>
    </a-modal>
</template>


<script lang="ts">
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive } from 'vue';
import { Fact } from '../../services/event';
import type { UploadProps } from 'ant-design-vue';

export default defineComponent({
    components: {PlusOutlined, UploadOutlined, DeleteOutlined},
    props: {
        editingFact: Boolean, 
    },
    setup(props, { emit }) {
        const fact = reactive<Fact>({
            id: '',
            statement: '',
            references: [],
            evidences: [],
        });
        const addReference = () => {
            fact.references.push({description: '', value: ''});
        };
        const addEvidence = () => {
            fact.evidences.push({description: '', imgs: []});
        };

        const deleteReference = (index) => {
            fact.references.splice(index, 1);
        };
        const deleteEvidence = (index) => {
            fact.evidences.splice(index, 1);
        }

        const handlePreview = async (file: UploadProps['fileList'][number]) => {
            console.log(file);
            window.open(file.url);
        };
        const onSave = () => {
            emit("saveNewFact", fact);
        }
        const onCancel = () => {
            emit("cancelNewFact");
        }
        return {
            fact,
            addReference,
            addEvidence,
            deleteReference,
            deleteEvidence,
            onCancel,
            onSave,
            handlePreview,
        };
    }
});
</script>


<style lang="less" scoped>
.itemGap {
    margin-top: 20px;
}
</style>