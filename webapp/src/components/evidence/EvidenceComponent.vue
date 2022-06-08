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
                    <div v-if="!preview" style="margin-top: 5px">
                        {{prettyPrintName(evidence)}}
                    </div>
                    <div v-if="!preview" style="margin-top: 5px">
                        {{formatFileSize(evidence?.rawFile.size)}}
                    </div>
                </div>
            </template>
        </a-popover>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FileOutlined } from '@ant-design/icons-vue';
import { BASE_URL } from '@/lib/constants';
import { Evidence } from '@/services/evidence';
import { formatFileSize } from '@/lib/format';

export default defineComponent({
    components: {FileOutlined},
    props: {
        evidence: Object as () => Evidence,
        preview: Boolean,
    },
    setup() {
        const fileUrl = (e: Evidence) => {
            return BASE_URL + "static/evidences/" + e.rawFile.hash;
        }

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

        const prettyPrintName = (e: Evidence) => {
            const len = e.name.length;
            let ext = e.name.split('.').pop();
            if (!ext || ext.length == len) {
                ext = "";
            }
            let filename = e.name.substring(0, len - ext.length - 1);
            if (filename.length > 10) {
                filename = filename.substring(0, 7);
                return filename + "..." + ext;
            } else {
                return filename + "." + ext;
            }
        }

        return {
            fileUrl,
            formatFileSize,
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