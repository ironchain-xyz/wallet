<template>
  <ContentComponent>
    <ProfileComponent />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProfileComponent from '@/components/ProfileComponent.vue'
import ContentComponent from '@/components/ContentComponent.vue'

@Options({
  components: {
    ContentComponent,
    ProfileComponent,
  },
})
export default class DiscoverView extends Vue { }
</script>