<template>
  <Collections />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Collections from '@/components/CollectionsComponent.vue'; // @ is an alias to /src

@Options({
  components: {
    Collections,
  },
})
export default class CollectionsView extends Vue { }
</script>