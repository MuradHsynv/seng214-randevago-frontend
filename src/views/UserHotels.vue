<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="none">
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/home"
            text="Back"
            style="color: var(--color-tetriary)"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center" size="large">My Hotels</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-menu-button :auto-hide="false"></ion-menu-button>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="isLoading" class="ion-text-center ion-padding">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Loading your hotels...</p>
      </div>

      <div v-else-if="hotels.length === 0" class="ion-text-center ion-padding">
        <p>You haven't added any hotels yet.</p>
      </div>

      <div v-else>
    <ion-card v-for="(hotel, index) in hotels" :key="hotel.id">
  <img
    :alt="hotel.name"
    :src="hotel.imageUrl || 'https://ionicframework.com/docs/img/demos/card-media.png'"
  />
  <ion-card-header>
    <ion-card-title>{{ hotel.name }}</ion-card-title>
    <ion-card-subtitle>
      <template v-if="hotel.rating && hotel.rating > 0 && hotel.rating <= 5">
        <ion-icon
          v-for="i in Math.floor(hotel.rating)"
          :key="'full-' + i + '-' + hotel.id"
          :icon="star"
          size="small"
          color="warning"
        />
        <ion-icon
          v-if="hotel.rating % 1 >= 0.5"
          :key="'half-' + hotel.id"
          :icon="starHalf"
          size="small"
          color="warning"
        />
      </template>
      <template v-else-if="hotel.location">
        {{ hotel.location }}
      </template>
      <template v-else>
        No Location/Rating Info
      </template>
    </ion-card-subtitle>
  </ion-card-header>

  <ion-card-content v-if="hotel.description">
    {{ hotel.description }}
  </ion-card-content>
  <ion-card-content
    v-if="hotel.price"
    style="font-weight: bold; color: var(--ion-color-primary); font-size: 1.1em;"
  >
    {{ hotel.price }}
  </ion-card-content>

  <ion-button
    expand="block"
    color="primary"
    @click="goToHotelDetails(hotel.id)"
    style="margin: 12px"
  >
    Book Now
  </ion-button>
</ion-card>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonSpinner, IonBackButton, IonMenuButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonButton
} from '@ionic/vue';
import { star, starHalf } from 'ionicons/icons';
import { toastController } from '@ionic/vue';

interface Hotel {
  id: string;
  name: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  price?: string;
  rating?: number | null;
}

const isLoading = ref(true);
const hotels = ref<Hotel[]>([]);
const router = useRouter();

const goToHotelDetails = (id: string) => {
  router.push(`/details`);
};

const fetchUserHotelsFromAPI = async (): Promise<Hotel[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return [
    {
      id: '101',
      name: 'Cozy User Hotel',
      description: 'Nice place for relaxing',
      location: 'Istanbul, Turkey',
      imageUrl: '',
      price: '150$',
      rating: 4
    },
    {
      id: '102',
      name: 'Budget Inn',
      location: 'Ankara, Turkey',
      price: '80$',
      rating: 3
    },
  ];
};

onMounted(async () => {
  isLoading.value = true;
  try {
    hotels.value = await fetchUserHotelsFromAPI();
  } catch (error) {
    const toast = await toastController.create({
      message: 'Error loading your hotels.',
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
</style>
