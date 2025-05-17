<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="none">
        <ion-buttons slot="start">
          <ion-back-button default-href="/search" text="Back"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">My Reservations</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button :auto-hide="false"></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">My Reservations</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="isLoading" class="ion-text-center ion-padding">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Loading your reservations...</p>
      </div>
      <div v-else-if="reservations.length === 0" class="ion-text-center ion-padding">
        <p>You have no reservations yet.</p>
        <ion-button router-link="/search" fill="clear">Find a Hotel</ion-button>
      </div>

      <ion-list v-else>
        <ion-card v-for="res in reservations" :key="res.reservationID" class="reservation-card">
          <ion-card-header>
            <ion-card-title>{{ res.hotelName }}</ion-card-title>
            <ion-card-subtitle>{{ res.roomType }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Check-in:</strong> {{ formatDate(res.checkInDate) }}</p>
            <p><strong>Check-out:</strong> {{ formatDate(res.checkOutDate) }}</p>
            <p><strong>Status:</strong> <ion-text :color="getStatusColor(res.status)">{{ res.status }}</ion-text></p>
            <p><strong>Total:</strong> ${{ res.totalAmount.toFixed(2) }}</p>
            <p><strong>Booked on:</strong> {{ formatDate(res.createdAt) }}</p>
            <p><strong>Guests:</strong> {{ res.guestCountAdults }} Adult(s)
              <span v-if="res.guestCountChildren > 0">, {{ res.guestCountChildren }} Child(ren)</span>
            </p>

            <div class="actions-bar ion-padding-top" v-if="canModifyOrCancel(res)">
              <ion-button fill="outline" size="small" @click="modifyReservation(res)">
                <ion-icon slot="start" :icon="pencilIcon"></ion-icon>
                Modify
              </ion-button>
              <ion-button fill="outline" size="small" color="danger" @click="confirmCancelReservation(res)">
                <ion-icon slot="start" :icon="closeCircleIcon"></ion-icon>
                Cancel
              </ion-button>
            </div>
            <div v-else-if="res.status === 'CANCELLED'" class="ion-padding-top">
                <ion-note color="danger">This reservation has been cancelled.</ion-note>
            </div>
             <div v-else-if="res.status === 'COMPLETED'" class="ion-padding-top">
                <ion-note color="success">This stay has been completed.</ion-note>
            </div>
          </ion-card-content>
        </ion-card>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonButtons, IonBackButton, IonMenuButton, IonSpinner, IonText, IonIcon,
  IonButton, IonNote, toastController, alertController
} from '@ionic/vue';
import { pencilOutline as pencilIcon, closeCircleOutline as closeCircleIcon } from 'ionicons/icons';
import { useRouter } from 'vue-router';

interface Reservation {
  reservationID: string;
  userID: string;
  hotelID: string;
  hotelName: string; 
  roomID: string;
  roomType: string; 
  checkInDate: string; 
  checkOutDate: string; 
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  totalAmount: number;
  guestCountAdults: number;
  guestCountChildren: number;
  createdAt: string; 
}

const isLoading = ref(true);
const reservations = ref<Reservation[]>([]);
const router = useRouter();

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const getStatusColor = (status: Reservation['status']) => {
  switch (status) {
    case 'CONFIRMED': return 'success';
    case 'PENDING_CONFIRMATION': return 'warning';
    case 'CANCELLED': return 'danger';
    case 'COMPLETED': return 'medium';
    case 'NO_SHOW': return 'medium';
    default: return 'dark';
  }
};

const canModifyOrCancel = (reservation: Reservation): boolean => {
  if (reservation.status !== 'CONFIRMED') return false;
  const checkIn = new Date(reservation.checkInDate);
  const today = new Date();
  const diffTime = checkIn.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 2;
};


const fetchMyReservationsAPI = async (userId: string): Promise<Reservation[]> => {
  console.log(`Fetching reservations for user ID: ${userId} (simulated)`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (userId === 'user_token_for_john.doe@example.com' || userId === 'user_token_for_jane.smith@example.com' || userId.includes('dummyRegularUserToken')) {
    return [
      { reservationID: 'res123', userID: userId, hotelID: 'h1', hotelName: 'Grand City Hotel', roomID: 'r101', roomType: 'Deluxe King Room', checkInDate: '2024-07-15', checkOutDate: '2024-07-18', status: 'CONFIRMED', totalAmount: 750.00, guestCountAdults: 2, guestCountChildren: 0, createdAt: '2024-05-10T10:00:00Z' },
      { reservationID: 'res124', userID: userId, hotelID: 'h2', hotelName: 'Cozy Country Inn', roomID: 'r202', roomType: 'Standard Double', checkInDate: '2024-08-01', checkOutDate: '2024-08-05', status: 'PENDING_CONFIRMATION', totalAmount: 480.00, guestCountAdults: 1, guestCountChildren: 1, createdAt: '2024-05-20T14:30:00Z' },
      { reservationID: 'res125', userID: userId, hotelID: 'h3', hotelName: 'Seaside Resort', roomID: 'r303', roomType: 'Ocean View Suite', checkInDate: '2024-04-10', checkOutDate: '2024-04-12', status: 'COMPLETED', totalAmount: 700.00, guestCountAdults: 2, guestCountChildren: 0, createdAt: '2024-03-01T18:00:00Z' },
       { reservationID: 'res126', userID: userId, hotelID: 'h4', hotelName: 'Downtown Hub', roomID: 'r401', roomType: 'Single Room', checkInDate: '2024-06-01', checkOutDate: '2024-06-03', status: 'CANCELLED', totalAmount: 160.00, guestCountAdults: 1, guestCountChildren: 0, createdAt: '2024-04-15T09:20:00Z' },
    ];
  }
  return [];
};

const cancelReservationAPI = async (reservationId: string): Promise<boolean> => {
    console.log(`Cancelling reservation ${reservationId} (simulated)`);
    await new Promise(resolve => setTimeout(resolve, 700));
    return true; 
};

onMounted(async () => {
  const userToken = localStorage.getItem('userToken'); 
  if (!userToken) {
    const toast = await toastController.create({ message: 'Please login to view your reservations.', duration: 3000, color: 'warning' });
    await toast.present();
    router.push('/login');
    isLoading.value = false;
    return;
  }
  try {
    reservations.value = await fetchMyReservationsAPI(userToken);
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    const toast = await toastController.create({ message: 'Could not load reservations.', duration: 3000, color: 'danger' });
    await toast.present();
  } finally {
    isLoading.value = false;
  }
});

const modifyReservation = async (reservation: Reservation) => {
  const toast = await toastController.create({ message: `Modification for reservation ${reservation.reservationID} not yet implemented.`, duration: 2000 });
  await toast.present();
  console.log("Modify reservation:", reservation);
};

const confirmCancelReservation = async (reservation: Reservation) => {
  const alert = await alertController.create({
    header: 'Cancel Reservation',
    message: `Are you sure you want to cancel your booking at ${reservation.hotelName} for ${formatDate(reservation.checkInDate)}?`,
    buttons: [
      { text: 'Keep Booking', role: 'cancel' },
      {
        text: 'Yes, Cancel',
        cssClass: 'danger',
        handler: async () => {
          const success = await cancelReservationAPI(reservation.reservationID);
          if (success) {
            const index = reservations.value.findIndex(r => r.reservationID === reservation.reservationID);
            if (index !== -1) {
              reservations.value[index].status = 'CANCELLED'; 
            }
            const toast = await toastController.create({ message: 'Reservation cancelled.', duration: 2000, color: 'success' });
            await toast.present();
          } else {
            const toast = await toastController.create({ message: 'Failed to cancel reservation. Please try again.', duration: 3000, color: 'danger' });
            await toast.present();
          }
        },
      },
    ],
  });
  await alert.present();
};

</script>

<style scoped>
.reservation-card {
  margin-bottom: 16px;
}
.actions-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
ion-card-title {
    font-size: 1.2em;
}
ion-card-subtitle {
    margin-bottom: 8px;
}
</style>