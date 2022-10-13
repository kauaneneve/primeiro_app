<style>
.container {
width: 100vw;
height: 100vh;
background: #836FFF;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
}
</style>
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 5</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 5</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="container"><h1>nico a lenda</h1> </div>
      
      
      <ExploreContainer name="Tab 5 page" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';

export default defineComponent({
  name: 'Tab5Page',
  components: { ExploreContainer, IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
});
</script>