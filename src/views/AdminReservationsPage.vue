<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="none">
        <ion-buttons slot="start">
          <ion-back-button default-href="/admin/hotels" text="Back"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">All Reservations</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button :auto-hide="false"></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">All Reservations</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <ion-searchbar
          v-model="searchTerm"
          placeholder="Search by Hotel, User Email, Status, ID"
          @ionInput="debouncedSearch"
          :debounce="500"
        ></ion-searchbar>
      </div>

      <div v-if="isLoading" class="ion-text-center ion-padding">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Loading reservations...</p>
      </div>
      <div v-else-if="filteredReservations.length === 0" class="ion-text-center ion-padding">
        <p>No reservations found matching your criteria.</p>
      </div>

      <ion-list v-else>
         <ion-item-sliding v-for="res in filteredReservations" :key="res.reservationID">
          <ion-item lines="inset">
            <ion-label>
              <h2>{{ res.hotelName }} - {{ res.roomType }}</h2>
              <p>User: {{ res.userEmail }} (ID: {{ res.userID }})</p>
              <p>Dates: {{ formatDate(res.checkInDate) }} to {{ formatDate(res.checkOutDate) }}</p>
              <p>Status: <ion-text :color="getStatusColor(res.status)">{{ res.status }}</ion-text></p>
              <p>Total: ${{ res.totalAmount.toFixed(2) }}</p>
            </ion-label>
          </ion-item>
           <ion-item-options side="end">
            <ion-item-option color="primary" @click="openAdminReservationModal(res, 'view')">
              <ion-icon slot="icon-only" :icon="eyeIcon"></ion-icon> View
            </ion-item-option>
            <ion-item-option color="tertiary" @click="openAdminReservationModal(res, 'edit')">
              <ion-icon slot="icon-only" :icon="pencilIcon"></ion-icon> Edit
            </ion-item-option>
            <ion-item-option color="danger" @click="adminConfirmCancelReservation(res)" v-if="res.status !== 'CANCELLED' && res.status !== 'COMPLETED'">
              <ion-icon slot="icon-only" :icon="closeCircleIcon"></ion-icon> Cancel
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-modal :is-open="isAdminModalOpen" @didDismiss="closeAdminReservationModal">
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ modalMode === 'edit' ? 'Edit Reservation' : 'Reservation Details' }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="closeAdminReservationModal">Close</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <div v-if="selectedReservation">
                <ion-list lines="full">
                    <ion-item>
                        <ion-label position="stacked">Reservation ID</ion-label>
                        <ion-input :value="selectedReservation.reservationID" readonly></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Hotel</ion-label>
                        <ion-input :value="selectedReservation.hotelName" readonly></ion-input>
                    </ion-item>
                     <ion-item>
                        <ion-label position="stacked">Room Type</ion-label>
                        <ion-input :value="selectedReservation.roomType" readonly></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">User Email</ion-label>
                        <ion-input :value="selectedReservation.userEmail" readonly></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Check-in Date</ion-label>
                        <ion-input v-model="editableReservationData.checkInDate" type="date" :readonly="modalMode === 'view'"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Check-out Date</ion-label>
                        <ion-input v-model="editableReservationData.checkOutDate" type="date" :readonly="modalMode === 'view'"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Status</ion-label>
                        <ion-select v-model="editableReservationData.status" interface="popover" :disabled="modalMode === 'view'">
                            <ion-select-option value="PENDING_CONFIRMATION">Pending Confirmation</ion-select-option>
                            <ion-select-option value="CONFIRMED">Confirmed</ion-select-option>
                            <ion-select-option value="CANCELLED">Cancelled</ion-select-option>
                            <ion-select-option value="COMPLETED">Completed</ion-select-option>
                            <ion-select-option value="NO_SHOW">No Show</ion-select-option>
                        </ion-select>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Total Amount ($)</ion-label>
                        <ion-input v-model.number="editableReservationData.totalAmount" type="number" :readonly="modalMode === 'view'"></ion-input>
                    </ion-item>
                </ion-list>

                <ion-button v-if="modalMode === 'edit'" expand="block" @click="handleAdminUpdateReservation" class="ion-margin-top" :disabled="isProcessingModal">
                     <ion-spinner v-if="isProcessingModal" name="dots" slot="start"></ion-spinner>
                    Update Reservation
                </ion-button>
            </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSearchbar,
  IonButtons, IonBackButton, IonMenuButton, IonSpinner, IonText, IonIcon, IonItemSliding, IonItemOption,
  IonModal, IonInput, IonSelect, IonSelectOption, IonButton,
  toastController, alertController
} from '@ionic/vue';
import { eyeOutline as eyeIcon, pencilOutline as pencilIcon, closeCircleOutline as closeCircleIcon } from 'ionicons/icons';

interface AdminReservationView {
  reservationID: string;
  userID: string;
  userEmail: string;
  hotelID: string;
  hotelName: string;
  roomID: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string; 
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  totalAmount: number;
  createdAt: string; 
}

const isLoading = ref(true);
const allReservations = ref<AdminReservationView[]>([]);
const searchTerm = ref('');

const isAdminModalOpen = ref(false);
const modalMode = ref<'view' | 'edit'>('view');
const selectedReservation = ref<AdminReservationView | null>(null);
const editableReservationData = reactive<Partial<AdminReservationView>>({});
const isProcessingModal = ref(false);


const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const getStatusColor = (status: AdminReservationView['status']) => {
  switch (status) {
    case 'CONFIRMED': return 'success';
    case 'PENDING_CONFIRMATION': return 'warning';
    case 'CANCELLED': return 'danger';
    case 'COMPLETED': return 'medium';
    case 'NO_SHOW': return 'medium';
    default: return 'dark';
  }
};

const fetchAllReservationsAPI = async (): Promise<AdminReservationView[]> => {
  console.log("Fetching all reservations (simulated for admin)...");
  await new Promise(resolve => setTimeout(resolve, 1200));
  return [
    { reservationID: 'resA1', userID: 'usr1', userEmail: 'john.doe@example.com', hotelID: 'h1', hotelName: 'Grand City Hotel', roomID: 'r101', roomType: 'Deluxe King', checkInDate: '2024-07-15', checkOutDate: '2024-07-18', status: 'CONFIRMED', totalAmount: 750.00, createdAt: '2024-05-10T10:00:00Z' },
    { reservationID: 'resA2', userID: 'usr2', userEmail: 'jane.smith@example.com', hotelID: 'h2', hotelName: 'Cozy Country Inn', roomID: 'r202', roomType: 'Standard Double', checkInDate: '2024-08-01', checkOutDate: '2024-08-05', status: 'PENDING_CONFIRMATION', totalAmount: 480.00, createdAt: '2024-05-20T14:30:00Z' },
    { reservationID: 'resA3', userID: 'usr3', userEmail: 'peter.jones@example.com', hotelID: 'h1', hotelName: 'Grand City Hotel', roomID: 'r102', roomType: 'Executive Suite', checkInDate: '2024-07-20', checkOutDate: '2024-07-22', status: 'CANCELLED', totalAmount: 900.00, createdAt: '2024-06-01T11:00:00Z' },
  ];
};

const updateReservationAPI = async (reservationData: Partial<AdminReservationView>): Promise<AdminReservationView> => {
    console.log("Updating reservation via API (simulated):", reservationData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const original = allReservations.value.find(r => r.reservationID === reservationData.reservationID);
    if (!original) throw new Error("Original reservation not found for update");
    return { ...original, ...reservationData } as AdminReservationView;
};

const cancelReservationAPI_Admin = async (reservationId: string): Promise<boolean> => {
    console.log(`Admin cancelling reservation ${reservationId} (simulated)`);
    await new Promise(resolve => setTimeout(resolve, 700));
    return true; 
};


onMounted(async () => {
  try {
    allReservations.value = await fetchAllReservationsAPI();
  } catch (error) {
    console.error("Failed to fetch all reservations:", error);
    const toast = await toastController.create({ message: 'Could not load reservations.', duration: 3000, color: 'danger' });
    await toast.present();
  } finally {
    isLoading.value = false;
  }
});

const filteredReservations = computed(() => {
  if (!searchTerm.value.trim()) {
    return allReservations.value;
  }
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  return allReservations.value.filter(res =>
    res.hotelName.toLowerCase().includes(lowerSearchTerm) ||
    res.userEmail.toLowerCase().includes(lowerSearchTerm) ||
    res.status.toLowerCase().includes(lowerSearchTerm) ||
    res.reservationID.toLowerCase().includes(lowerSearchTerm)
  );
});

let debounceTimer: any;
const debouncedSearch = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
    }, 500);
};

const openAdminReservationModal = (reservation: AdminReservationView, mode: 'view' | 'edit') => {
    selectedReservation.value = reservation;
    Object.assign(editableReservationData, reservation);
    modalMode.value = mode;
    isAdminModalOpen.value = true;
};

const closeAdminReservationModal = () => {
    isAdminModalOpen.value = false;
    selectedReservation.value = null;
    Object.keys(editableReservationData).forEach(key => delete editableReservationData[key as keyof AdminReservationView]);
};

const handleAdminUpdateReservation = async () => {
    if (!selectedReservation.value || !editableReservationData.reservationID) return;

    if (new Date(editableReservationData.checkOutDate!) < new Date(editableReservationData.checkInDate!)) {
        const toast = await toastController.create({ message: 'Check-out date cannot be before check-in date.', duration: 2000, color: 'warning' });
        await toast.present();
        return;
    }

    isProcessingModal.value = true;
    try {
        const updatedReservation = await updateReservationAPI(editableReservationData);
        const index = allReservations.value.findIndex(r => r.reservationID === updatedReservation.reservationID);
        if (index !== -1) {
            allReservations.value[index] = updatedReservation;
        }
        closeAdminReservationModal();
        const toast = await toastController.create({ message: 'Reservation updated successfully.', duration: 2000, color: 'success' });
        await toast.present();
    } catch (error) {
        console.error("Error updating reservation:", error);
        const toast = await toastController.create({ message: 'Failed to update reservation.', duration: 3000, color: 'danger' });
        await toast.present();
    } finally {
        isProcessingModal.value = false;
    }
};

const adminConfirmCancelReservation = async (reservation: AdminReservationView) => {
  if (reservation.status === 'CANCELLED' || reservation.status === 'COMPLETED') {
      const toast = await toastController.create({ message: 'This reservation cannot be cancelled further.', duration: 2000, color: 'medium' });
      await toast.present();
      return;
  }
  const alert = await alertController.create({
    header: 'Admin: Cancel Reservation',
    message: `Are you sure you want to cancel reservation ${reservation.reservationID} for ${reservation.userEmail}?`,
    buttons: [
      { text: 'Keep Reservation', role: 'cancel' },
      {
        text: 'Yes, Cancel',
        cssClass: 'danger',
        handler: async () => {
          isProcessingModal.value = true; 
          try {
            const success = await cancelReservationAPI_Admin(reservation.reservationID);
            if (success) {
              const index = allReservations.value.findIndex(r => r.reservationID === reservation.reservationID);
              if (index !== -1) {
                allReservations.value[index].status = 'CANCELLED';
              }
              const toast = await toastController.create({ message: 'Reservation cancelled by admin.', duration: 2000, color: 'success' });
              await toast.present();
            } else {
              throw new Error("API cancellation failed");
            }
          } catch (error) {
             console.error("Error admin cancelling reservation:", error);
             const toast = await toastController.create({ message: 'Failed to cancel reservation.', duration: 3000, color: 'danger' });
             await toast.present();
          } finally {
              isProcessingModal.value = false;
          }
        },
      },
    ],
  });
  await alert.present();
};

</script>

<style scoped>
ion-searchbar {
  margin-bottom: 10px;
}
ion-item-option { 
    border-radius: 5px;
    margin: 2px;
}
</style>