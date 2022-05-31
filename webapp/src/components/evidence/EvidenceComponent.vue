<template>
    <div class="evidenceWrapper">
        <a-popover placement="bottom" :title="evidence.name">
            <template #content>
                <a :href="fileUrl(evidence)">View Source</a>
            </template>
            <img v-if="fileType(evidence) == 'image'" :src="fileUrl(evidence)" :alt="evidence.hash"/>
            <video v-if="fileType(evidence) == 'video'" controls>
                <source :src="fileUrl(evidence)" type="video/mp4">
            </video>
            <template v-if="fileType(evidence) == 'file'">
                <div>
                    <div>
                        <FileOutlined class="largeIcon" :class="preview ? 'centerIcon' : 'adjustedIcon'"/>
                    </div>
                    <div v-if="!preview" style="margin-top: 5px">{{prettyPrintName(evidence)}}</div>
                    <div v-if="!preview" style="margin-top: 5px">{{calFileSize(evidence)}}</div>
                </div>
            </template>
        </a-popover>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FileOutlined } from '@ant-design/icons-vue';
import { BASE_URL } from '@/lib/constants';
import { File } from '../../services/evidence';

export default defineComponent({
    components: {FileOutlined},
    props: {
        evidence: File,
        preview: Boolean,
    },
    setup() {
        const fileUrl = (file: File) => {
            return BASE_URL + "static/evidences/" + file.contentHash;
        }

        const fileType = (file: File) => {
            if (file.mimeType == "image/png" ||
                file.mimeType == "image/jpeg" || 
                file.mimeType == "image/jpg") {
                return "image";
            } else if (file.mimeType == "video/mp4") {
                return "video";
            } else {
                return "file";
            }
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

        const prettyPrintName = (file: File) => {
            const len = file.name.length;
            let ext = file.name.split('.').pop();
            if (!ext || ext.length == len) {
                ext = "";
            }
            let filename = file.name.substring(0, len - ext.length - 1);
            if (filename.length > 10) {
                filename = filename.substring(0, 7);
                return filename + "..." + ext;
            } else {
                return filename + "." + ext;
            }
        }

        return {
            fileUrl,
            calFileSize,
            fileType,
            prettyPrintName,
        }
    }
});
</script>

<style lang="less" scoped>
.evidenceWrapper {
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

video {
    width:100%;
    max-height: 100%;
}

.largeIcon {
    font-size: 16px;
}

.adjustedIcon {
    margin-top: 15px;
}
</style>