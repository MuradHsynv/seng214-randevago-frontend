<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
               <ion-button @click="goBack" style="color: var(--color-tetriary)">
            Back
          </ion-button>
        </ion-buttons>
        <ion-title>Hotel Detail</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-menu-button :auto-hide="false"></ion-menu-button>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="hotel">
        <img
          :src="hotel.imageUrl || 'https://ionicframework.com/docs/img/demos/card-media.png'"
          alt="Hotel image"
          style="width: 100%; border-radius: 8px; margin-bottom: 16px;"
        />
        <h2>{{ hotel.name }}</h2>
        <p>{{ hotel.description || 'No description available.' }}</p>
        <p><strong>Location:</strong> {{ hotel.location }}</p>
        <p><strong>Price:</strong> {{ hotel.price }}</p>
        <ion-button expand="block" color="primary" style="margin-top: 16px;" @click="goToPayment">
          Confirm Booking
        </ion-button>
      </div>
      <div v-else class="ion-text-center">
        <ion-spinner name="crescent"></ion-spinner>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonMenuButton, IonSpinner
} from '@ionic/vue';

interface Hotel {
  id: string;
  name: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  price?: string;
}

const route = useRoute();
const router = useRouter();

const hotel = ref<Hotel | null>(null);

// Geri dönüş için fonksiyon
const goBack = () => {
  router.push('/user-hotels');
};
const goToPayment = () => {
  router.push({ path: '/payment', query: { hotelId: hotel.value?.id || '' } });
};


// Simüle edilmiş otel bilgisi
onMounted(() => {
  const id = route.params.id as string;
  hotel.value = {
    id,
    name: 'Cozy User Hotel',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a sem quis nunc dignissim tincidunt.',
    location: 'Istanbul, Turkey',
    price: '150$',
    imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png',
  };
});
</script>
