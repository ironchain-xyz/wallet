<template>
  <div class="formContainer">
    <div class="formContent">
        <a-row>
            <a-typography-title :level="2">Event Name</a-typography-title>
        </a-row>
        <a-row>
            <a-input v-model:value="event.name" size="large" :bordered="false" :maxlength="50"/>
        </a-row>
        <a-divider/>
        <a-row>
            <a-typography-title :level="2">Description</a-typography-title>
        </a-row>
        <a-row>
             <a-textarea :rows="4" v-model:value="event.description" placeholder="Tell me about the event"/>
        </a-row>
        <a-row class="titleGap">
            <a-typography-title v-if="event.facts.length > 0" :level="2">Facts</a-typography-title>
        </a-row>
        <a-row v-for="(fact, index) in event.facts" v-bind:key="index">
            <div>
                <a-button @click="() => deleteFact(index)">
                <template #icon><DeleteOutlined /></template>
                Delete
            </a-button>
        </div>
        </a-row>
        <a-row type="flex" style="justify-content: center; margin-top: 20px">
          <a-button type="primary" @click="() => addFact()">
            <template #icon><PlusOutlined /></template>
            Add a fact
          </a-button>
        </a-row>
        <NewFactComponent
            :editingFact="editingFact"
            @saveNewFact="onSaveNewFact"
            @cancelNewFact="onCancelNewFact"
        ></NewFactComponent>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';

import router from '../router';
import { useStore } from '../store';
import { authenticate } from '../services/auth';
import { Event } from '../services/event';

import NewFactComponent from './event/NewFactComponent.vue';

export default defineComponent({
  components: {DeleteOutlined, PlusOutlined, NewFactComponent},
  setup() {
    const store = useStore();
    if (!authenticate(store)) return;
    if (!store.state.profile?.username) {
      router.push('init');
    }

    const event = reactive<Event>({
        id: '',
        name: '',
        description: '',
        facts: []
    });
    const editingFact = ref<boolean>(false);
    const addFact = () => {
        editingFact.value = true;
    };
    const onSaveNewFact = () => {
        editingFact.value = false;
    };
    const onCancelNewFact = () => {
        editingFact.value = false;
    };
    const deleteFact = (index) => {
        event.facts.splice(index, 1);
    };
    return {
        event,
        addFact,
        deleteFact,
        editingFact,
        onSaveNewFact,
        onCancelNewFact,
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
</style>