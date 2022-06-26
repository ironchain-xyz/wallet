<template>
    <a-row
        v-for="(reference, index) in references"
        v-bind:key="reference.hash"
        class="refWrapper"
        type="flex"
        justify="space-between"
        align="middle"
    >
        <a-col :span="4">
            <a-avatar :size="30" class="avatar" shape="square">
                {{ reference.creator.username.substring(0, 1).toUpperCase() }}
            </a-avatar>
            <a-row justify="center">
                {{reference.creator.username}}
            </a-row>
        </a-col>
        <a-col :span="9">
            {{reference.description.substring(0, 100)}}
        </a-col>
        <a-col :span="9">
            <a-row>
                <Evidences :evidences="reference.evidences.slice(0, 3)" :thumbnail="true"/>
            </a-row>
        </a-col>
        <a-col :span="2">
            <a :href="'/record/' + reference.hash">
                <a-button type="text">
                    <template #icon>
                        <InfoCircleOutlined />
                    </template>
                </a-button>
            </a>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Record } from '@/services/record';
import { Evidence } from '@/services/evidence';
import { shortDescription } from '@/services/utils'
import { BASE_URL } from '@/lib/constants';
import Evidences from '@/components/record/EvidencesComponent.vue'
import { formatDate } from '@/lib/format';
import { InfoCircleOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    components: { Evidences, InfoCircleOutlined },
    props: {
        references: Object as () => Record[],
    },
    setup() {
        const fileUrl = (e: Evidence) => {
            return BASE_URL + "static/evidences/" + e.rawFile.hash;
        };

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
            shortDescription,
            fileUrl,
            fileType,
            calFileSize,
            formatDate
        }
    }
});
</script>

<style lang="less" scoped>
.avatar {
    font-weight: bold;
    background-color: #1890ff;
}

.refWrapper {
    border-style: solid;
    border-color: gray;
    color: black;
    padding: 5px;
    margin-top: 10px;
}
</style>
