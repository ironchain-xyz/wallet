<template>
    <a-row class="border" style="padding: 0px;">
        <a-typography-title strong :level="5" style="padding: 10px 15px; margin: 0px;">
            Subscribed Spaces
        </a-typography-title>
        <a-divider style="margin: 0px;"></a-divider>
        <a-row gutter="16" style="padding: 15px; width: 100%;">
            <a-col v-for="space in subscription" v-bind:key="space.name">
                <a :href='"/space/" + space.id'>
                    <a-row justify="center">
                        <a-avatar :size="55" class="avatar" shape="square">
                            {{ space.name.substring(0, 1).toUpperCase() }}
                        </a-avatar>
                    </a-row>
                    <a-row justify="center" style="margin-top: 5px;">
                        <a-typography-text strong>
                            {{ space.name }}
                        </a-typography-text>
                    </a-row>   
                </a>
            </a-col>
            <a-typography-text
                v-if="subscription.length == 0"
                style="padding: 0px 10px;"
            >
                No Space
            </a-typography-text>
        </a-row>
    </a-row>
    <a-row class="border" style="padding: 0px; margin-top: 30px;">
        <a-typography-title strong :level="5" style="padding: 10px 15px; margin: 0px;">
            Profile
        </a-typography-title>
        <a-divider style="margin: 0px;"></a-divider>
        <a-row style="padding: 15px; width: 100%;">
            <a-typography style="text-align: left;">
            <a-typography-title strong :level="5">
                Username
            </a-typography-title>
            <a-typograph-paragraph>
                {{ username }}
            </a-typograph-paragraph>
            <a-typography-title strong :level="5" style="margin-top: 20px;">
                Email
            </a-typography-title>
            <a-typograph-paragraph>
                {{ email }}
            </a-typograph-paragraph>
            <a-typography-title strong :level="5" style="margin-top: 20px;">
                Invitation Code
            </a-typography-title>
            <a-typography-paragraph
                v-for="{ code, used } in invitationCodes"
                v-bind:key="code"
                :class="{ used }"
                :copyable="!used"
                style="margin: 0px;"
            >
                {{ code }}
            </a-typography-paragraph>
        </a-typography>
        </a-row>
    </a-row>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from '@/store';
import { getInvitationCode, getSubscribedSpaces } from '@/services/user';

export default defineComponent({
    setup() {
        const store = useStore();
        const invitationCodes = computed(() => store.state.user?.invitationCodes);
        const subscription = computed(() => Object.values(store.state.subscription));

        onMounted(() => {
            if (!invitationCodes.value) {
                getInvitationCode(store).then((res) => {
                    store.commit("initInvitationCodes", res.codes)
                });
            }

            if (!subscription.value) {
                getSubscribedSpaces(store.state.user!.id).then(spaces => {
                    store.commit("setSubscription", spaces)
                });
            }
        });

        const username = computed(() => {
            return store.state.user!.username!
        });
        const email = computed(() => {
            return store.state.user!.email
        });

        return {
            email,
            username,
            subscription,
            invitationCodes,
        };
    },
});
</script>

<style lang="less" scoped>
.used {
    text-decoration: line-through;
    font-style: italic;
}

.field {
    margin-bottom: 50px;
    margin-left: auto;
    margin-right: auto;
}

.avatar {
    font-weight: bold;
    background-color: #209645;
}
</style>