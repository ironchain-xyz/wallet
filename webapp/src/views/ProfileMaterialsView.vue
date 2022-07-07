<template>
  <ContentComponent>
    <ProfileMaterialsComponent />
  </ContentComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProfileMaterialsComponent from '@/components/profile/ProfileMaterialsComponent.vue'
import ContentComponent from '@/components/ContentComponent.vue'

@Options({
  components: {
    ContentComponent,
    ProfileMaterialsComponent,
  },
})
export default class ProfileMaterialsView extends Vue { }
</script>