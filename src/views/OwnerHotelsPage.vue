<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="none"> 
        <ion-buttons slot="start">
          <ion-back-button default-href="/search" text="Back"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">My Hotels</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button :auto-hide="false"></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">My Hotels</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="isLoading" class="ion-text-center ion-padding">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Loading your hotels...</p>
      </div>
      <div v-else-if="ownerHotels.length === 0" class="ion-text-center ion-padding">
        <p>You haven't added any hotels yet.</p>
        <p>Click the '+' button to add your first hotel.</p>
      </div>

      <div v-else>
        <ion-card v-for="hotel in ownerHotels" :key="hotel.id">
          <img :alt="hotel.name" :src="hotel.imageUrl || 'https://ionicframework.com/docs/img/demos/card-media.png'" />
          <ion-card-header>
            <ion-card-title>{{ hotel.name }}</ion-card-title>
            <ion-card-subtitle>
              <template v-if="hotel.rating !== undefined && hotel.rating !== null && hotel.rating > 0 && hotel.rating <= 5">
                <ion-icon v-for="i in Math.floor(hotel.rating)" :key="'full-' + i + '-' + hotel.id" :icon="star" size="small" color="warning"/>
                <ion-icon v-if="hotel.rating % 1 >= 0.5" :key="'half-' + hotel.id" :icon="starHalf" size="small" color="warning"/>
              </template>
              <template v-else-if="hotel.location">{{ hotel.location }}</template>
              <template v-else>No Location/Rating Info</template>
            </ion-card-subtitle>
            <ion-badge :color="hotel.isActive ? 'success' : 'medium'" style="margin-top: 5px;">
              {{ hotel.isActive ? 'Active' : 'Inactive' }}
            </ion-badge>
          </ion-card-header>
          <ion-card-content v-if="hotel.description">{{ hotel.description }}</ion-card-content>
          <ion-card-content v-if="hotel.price" style="font-weight: bold; color: var(--ion-color-primary); font-size: 1.1em;">
            {{ hotel.price }}
          </ion-card-content>
          <ion-item lines="none" class="card-actions">
            <ion-button fill="clear" size="small" @click="openEditHotelModal(hotel)">
              <ion-icon slot="start" :icon="pencilIcon"></ion-icon>Edit
            </ion-button>
            <ion-button fill="clear" size="small" color="danger" @click="confirmRemoveHotel(hotel)">
              <ion-icon slot="start" :icon="trashIcon"></ion-icon>Remove
            </ion-button>
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
            <ion-buttons slot="end"><ion-button @click="closeModal">Close</ion-button></ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="floating">Hotel Name *</ion-label>
            <ion-input v-model="currentHotel.name" type="text" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Description</ion-label>
            <ion-textarea v-model="currentHotel.description" :auto-grow="true"></ion-textarea>
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
import { ref, onMounted, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonModal,
  IonButton, IonButtons, IonItem, IonLabel, IonInput, IonTextarea, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonSpinner, IonToggle, IonBadge, IonBackButton, IonMenuButton,
  toastController, alertController,
} from '@ionic/vue';
import { addOutline as addIcon, pencilOutline as pencilIcon, trashOutline as trashIcon, star, starHalf } from 'ionicons/icons';
import { useRouter } from 'vue-router'; 

interface Hotel {
  id: string;
  ownerId: string; 
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
const allMockHotels = ref<Hotel[]>([ 
    { id: '1', ownerId: 'owner123', name: 'Owner One Plaza', description: 'My first great hotel.', location: 'New York, USA', imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png', price: '350$', rating: 5, isActive: true },
    { id: '2', ownerId: 'owner123', name: 'Owner One Seaside', description: 'My lovely beach inn.', location: 'Malibu, USA', imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png', price: '280$', rating: 4, isActive: true },
    { id: '3', ownerId: 'owner456', name: 'Other Owner Lodge', description: 'Not mine, but a nice place.', location: 'Aspen, USA', price: '220$', rating: 4, isActive: false },
    { id: 'adminHotel1', ownerId: 'admin', name: 'Admin Managed Central', description: 'An admin added hotel.', location: 'Downtown', price: '190$', rating: 4.2, isActive: true },
]);
const ownerHotels = ref<Hotel[]>([]); 
const isModalOpen = ref(false);

const initialHotelState = (): Partial<Hotel> => ({
  id: undefined,
  ownerId: localStorage.getItem('ownerId') || '', 
  name: '',
  description: '',
  location: '',
  imageUrl: '',
  price: '',
  rating: null,
  isActive: true,
});
const currentHotel = ref<Partial<Hotel>>(initialHotelState());
const router = useRouter(); 

const loggedInOwnerId = ref<string | null>(null);

const fetchOwnerHotelsAPI = async (ownerId: string): Promise<Hotel[]> => {
  console.log(`Fetching hotels for owner ID: ${ownerId} (simulated)`);
  await new Promise(resolve => setTimeout(resolve, 700));
  return allMockHotels.value.filter(hotel => hotel.ownerId === ownerId);
};

const saveHotelAPI = async (hotelData: Hotel): Promise<Hotel> => {
  isSaving.value = true;
  console.log("Saving hotel to API (simulated):", hotelData);
  await new Promise(resolve => setTimeout(resolve, 800));
  isSaving.value = false;
  
  const idToUse = hotelData.id || `hotel${Date.now()}`;
  const hotelWithId = { ...hotelData, id: idToUse };

  if (hotelData.id) { // Editing
    const index = allMockHotels.value.findIndex(h => h.id === hotelData.id);
    if (index !== -1 && allMockHotels.value[index].ownerId === hotelData.ownerId) {
        allMockHotels.value[index] = hotelWithId;
    } else { throw new Error("Hotel not found or unauthorized"); }
  } else { 
    allMockHotels.value.push(hotelWithId);
  }
  return hotelWithId;
};

const deleteHotelAPI = async (hotelId: string, ownerId: string): Promise<void> => {
  console.log(`Deleting hotel ${hotelId} for owner ${ownerId} (simulated)`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = allMockHotels.value.findIndex(h => h.id === hotelId && h.ownerId === ownerId);
  if (index !== -1) {
    allMockHotels.value.splice(index, 1);
  } else { throw new Error("Hotel not found or unauthorized for deletion"); }
};


onMounted(async () => {
  loggedInOwnerId.value = localStorage.getItem('ownerId');
  if (!loggedInOwnerId.value) {
    const toast = await toastController.create({ message: 'Hotel owner not identified. Please login again.', duration: 3000, color: 'danger' });
    await toast.present();
    router.push('/login'); 
    isLoading.value = false;
    return;
  }
  try {
    ownerHotels.value = await fetchOwnerHotelsAPI(loggedInOwnerId.value);
  } catch (error) {
    console.error("Failed to fetch owner hotels:", error);
    const toast = await toastController.create({ message: 'Error loading your hotels.', duration: 3000, color: 'danger' });
    await toast.present();
  } finally {
    isLoading.value = false;
  }
});

const openAddHotelModal = () => {
  currentHotel.value = initialHotelState(); 
  isModalOpen.value = true;
};

const openEditHotelModal = (hotelToEdit: Hotel) => {
  if(hotelToEdit.ownerId !== loggedInOwnerId.value) {
      toastController.create({message: "You can only edit your own hotels.", duration: 2000, color: "danger"}).then(t => t.present());
      return;
  }
  currentHotel.value = { ...hotelToEdit };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSaveHotel = async () => {
  if (!currentHotel.value.name || !currentHotel.value.rating || currentHotel.value.rating < 1 || currentHotel.value.rating > 5) {
    const toast = await toastController.create({ message: 'Hotel name and a valid rating (1-5) are required.', duration: 2500, color: 'warning' });
    await toast.present();
    return;
  }
  if (!currentHotel.value.ownerId) { 
      const toast = await toastController.create({ message: 'Owner information missing.', duration: 2000, color: 'danger'});
      await toast.present();
      return;
  }

  try {
    const hotelToSave: Hotel = {
      id: currentHotel.value.id || `hotel${Date.now()}`,
      ownerId: currentHotel.value.ownerId,
      name: currentHotel.value.name!,
      description: currentHotel.value.description,
      location: currentHotel.value.location,
      imageUrl: currentHotel.value.imageUrl,
      price: currentHotel.value.price,
      rating: currentHotel.value.rating,
      isActive: currentHotel.value.isActive === undefined ? true : currentHotel.value.isActive,
    };

    const savedHotel = await saveHotelAPI(hotelToSave);
    if (loggedInOwnerId.value) {
        ownerHotels.value = await fetchOwnerHotelsAPI(loggedInOwnerId.value); 
    }
    closeModal();
    const toast = await toastController.create({
        message: `Hotel successfully ${currentHotel.value.id ? 'updated' : 'added'}.`,
        duration: 2000,
        color: 'success'
    });
    await toast.present();
  } catch (error) {
    console.error("Failed to save hotel:", error);
    const toast = await toastController.create({ message: 'Error saving hotel.', duration: 3000, color: 'danger' });
    await toast.present();
  }
};

const confirmRemoveHotel = async (hotelToRemove: Hotel) => {
  if(hotelToRemove.ownerId !== loggedInOwnerId.value) {
      toastController.create({message: "You can only remove your own hotels.", duration: 2000, color: "danger"}).then(t => t.present());
      return;
  }
  const alert = await alertController.create({
    header: 'Confirm Delete',
    message: `Are you sure you want to remove "${hotelToRemove.name}"?`,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Remove', cssClass: 'danger', handler: () => removeHotel(hotelToRemove.id) },
    ],
  });
  await alert.present();
};

const removeHotel = async (hotelId: string) => {
  if (!loggedInOwnerId.value) return;
  try {
    await deleteHotelAPI(hotelId, loggedInOwnerId.value);
    ownerHotels.value = ownerHotels.value.filter(hotel => hotel.id !== hotelId);
    const toast = await toastController.create({ message: 'Hotel removed successfully.', duration: 2000, color: 'success' });
    await toast.present();
  } catch (error) {
    console.error("Failed to remove hotel:", error);
    const toast = await toastController.create({ message: 'Error removing hotel.', duration: 3000, color: 'danger' });
    await toast.present();
  }
};

</script>

<style scoped>
ion-card { margin: 16px; }
ion-card-subtitle ion-icon { vertical-align: middle; }
ion-card-content[style*="font-weight: bold"] { margin-top: 8px; }
.card-actions { justify-content: flex-end; padding-top: 0; padding-bottom: 8px; }
.card-actions ion-button { margin-inline-start: 4px; }
</style>