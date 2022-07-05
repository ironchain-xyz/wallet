<template>
  <ContentComponent>
    <ProfileAboutComponent />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProfileAboutComponent from '@/components/profile/ProfileAboutComponent.vue'
import ContentComponent from '@/components/ContentComponent.vue'

@Options({
  components: {
    ContentComponent,
    ProfileAboutComponent,
  },
})
export default class ProfileAboutView extends Vue { }
</script>