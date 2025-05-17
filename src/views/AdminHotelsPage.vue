<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/"
            text="Back"
            style="color: var(--color-tetriary)"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>Randevago</ion-title>
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
        <p>Loading hotels...</p>
      </div>

      <div v-else-if="hotels.length === 0" class="ion-text-center ion-padding">
        <p>No hotels have been added yet.</p>
        <p>Use the '+' button in the bottom right to add one.</p>
      </div>

      <div v-else>
        <ion-card v-for="hotel in hotels" :key="hotel.id">
          <img
            :alt="hotel.name"
            :src="hotel.imageUrl || 'https://ionicframework.com/docs/img/demos/card-media.png'"
          />
          <ion-card-header>
            <ion-card-title>{{ hotel.name }}</ion-card-title>
            <ion-card-subtitle>
              <template v-if="hotel.rating !== undefined && hotel.rating !== null && hotel.rating > 0 && hotel.rating <= 5">
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
             <ion-badge :color="hotel.isActive ? 'success' : 'medium'" style="margin-top: 5px;">
              {{ hotel.isActive ? 'Active' : 'Inactive' }}
            </ion-badge>
          </ion-card-header>
          <ion-card-content v-if="hotel.description">
            {{ hotel.description }}
          </ion-card-content>
          <ion-card-content v-if="hotel.price" style="font-weight: bold; color: var(--ion-color-primary); font-size: 1.1em;">
            {{ hotel.price }}
          </ion-card-content>
           <ion-item lines="none">
             <ion-button fill="clear" size="small" @click="openEditModal(hotel)">Edit</ion-button>
           </ion-item>
        </ion-card>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openAddHotelModal">
          <ion-icon :icon="addIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ currentHotel.id ? 'Edit Hotel' : 'Add New Hotel' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="floating">Hotel Name *</ion-label>
            <ion-input v-model="currentHotel.name" type="text" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Description</ion-label>
            <ion-textarea v-model="currentHotel.description" auto-grow="true"></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Location (e.g., City, Country)</ion-label>
            <ion-input v-model="currentHotel.location" type="text"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Main Image URL</ion-label>
            <ion-input v-model="currentHotel.imageUrl" type="url"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Representative Price (e.g., 255$)</ion-label>
            <ion-input v-model="currentHotel.price" type="text"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Star Rating (1-5)*</ion-label>
            <ion-input v-model.number="currentHotel.rating" type="number" min="1" max="5" step="1" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>Is Active?</ion-label>
            <ion-toggle slot="end" v-model="currentHotel.isActive"></ion-toggle>
          </ion-item>
          <ion-button expand="block" @click="handleSaveHotel" class="ion-margin-top" :disabled="isSaving">
            <ion-spinner v-if="isSaving" name="dots" slot="start"></ion-spinner>
            {{ currentHotel.id ? 'Update Hotel' : 'Save Hotel' }}
          </ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSpinner,
  toastController,
  IonBackButton,
  IonMenuButton,
  IonToggle,
  IonBadge,
} from '@ionic/vue';
import { add as addIcon, star, starHalf } from 'ionicons/icons';

interface Hotel {
  id: string;
  name: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  price?: string;
  rating?: number | null;
  isActive?: boolean;
}

const isLoading = ref(true);
const isSaving = ref(false);
const hotels = ref<Hotel[]>([]);
const isModalOpen = ref(false);

const initialHotelState = (): Partial<Hotel> => ({
  id: undefined,
  name: '',
  description: '',
  location: '',
  imageUrl: '',
  price: '',
  rating: null,
  isActive: true,
});
const currentHotel = ref<Partial<Hotel>>(initialHotelState());

const fetchHotelsFromAPI = async (): Promise<Hotel[]> => {
  console.log("Fetching hotels from API...");
  await new Promise(resolve => setTimeout(resolve, 700));
  return [
    { id: '1', name: 'Grand Plaza Hotel', description: 'A luxurious stay in the city center with premium amenities.', location: 'New York, USA', imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png', price: '350$', rating: 5, isActive: true },
    { id: '2', name: 'Seaside Boutique Inn', description: 'Charming inn by the sea, perfect for a getaway.', location: 'Malibu, USA', imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png', price: '280$', rating: 4, isActive: true },
    { id: '3', name: 'Mountain View Lodge', description: 'Breathtaking views and cozy cabins.', location: 'Aspen, USA', price: '220$', rating: 4, isActive: false },
  ];
};

const saveHotelToAPI = async (hotelData: Hotel): Promise<Hotel> => {
  isSaving.value = true;
  console.log("Saving hotel to API:", hotelData);
  await new Promise(resolve => setTimeout(resolve, 800));
  isSaving.value = false;
  const idToUse = hotelData.id || String(Date.now());
  return { ...hotelData, id: idToUse } as Hotel;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    hotels.value = await fetchHotelsFromAPI();
  } catch (error) {
    console.error("Failed to fetch hotels:", error);
    const toast = await toastController.create({ message: 'Error loading hotels.', duration: 3000, color: 'danger' });
    toast.present();
  } finally {
    isLoading.value = false;
  }
});

const openAddHotelModal = () => {
  currentHotel.value = initialHotelState();
  isModalOpen.value = true;
};

const openEditModal = (hotelToEdit: Hotel) => {
  currentHotel.value = { ...hotelToEdit };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSaveHotel = async () => {
  if (!currentHotel.value.name || !currentHotel.value.rating || currentHotel.value.rating < 1 || currentHotel.value.rating > 5) {
    const toast = await toastController.create({
        message: 'Hotel name and a valid rating (1-5) are required.',
        duration: 2500,
        color: 'warning'
    });
    toast.present();
    return;
  }

  try {
    const hotelToSave: Hotel = {
        id: currentHotel.value.id || String(Date.now()),
        name: currentHotel.value.name!,
        description: currentHotel.value.description,
        location: currentHotel.value.location,
        imageUrl: currentHotel.value.imageUrl,
        price: currentHotel.value.price,
        rating: currentHotel.value.rating,
        isActive: currentHotel.value.isActive === undefined ? true : currentHotel.value.isActive,
    };

    const savedHotel = await saveHotelToAPI(hotelToSave);

    if (currentHotel.value.id) {
      const index = hotels.value.findIndex(h => h.id === savedHotel.id);
      if (index !== -1) {
        hotels.value[index] = savedHotel;
      }
    } else {
      hotels.value.unshift(savedHotel);
    }
    closeModal();
    const toast = await toastController.create({
        message: `Hotel successfully ${currentHotel.value.id ? 'updated' : 'added'}.`,
        duration: 2000,
        color: 'success'
    });
    toast.present();
  } catch (error) {
    console.error("Failed to save hotel:", error);
     const toast = await toastController.create({ message: 'Error saving hotel.', duration: 3000, color: 'danger' });
    toast.present();
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
ion-card {
  margin: 16px;
}
ion-card-subtitle ion-icon {
  vertical-align: middle;
}
ion-card-content[style*="font-weight: bold"] {
  margin-top: 8px;
}
ion-card ion-item[lines="none"] ion-button {
  margin-inline-start: auto;
}
</style>