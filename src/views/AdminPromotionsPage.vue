<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/admin/hotels"
            text="Back"
            style="color: var(--color-tetriary)"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>Promotions</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-menu-button :auto-hide="false"></ion-menu-button>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Promotions</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="isLoading" class="ion-text-center ion-padding">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Loading promotions...</p>
      </div>

      <div v-else-if="promotions.length === 0" class="ion-text-center ion-padding">
        <p>No promotions have been created yet.</p>
      </div>

<ion-list v-else>
    <ion-item-sliding v-for="promo in promotions" :key="promo.id">
      <ion-item>
        <ion-label>
          <h2>{{ promo.code }} - <ion-text :color="promo.isActive ? 'success' : 'medium'">{{ promo.isActive ? 'Active' : 'Inactive' }}</ion-text></h2>
          <p>{{ promo.description }}</p>
          <p>
            Discount: {{ promo.discountValue }}{{ promo.discountType === 'PERCENTAGE' ? '%' : '$ (Fixed)' }}
          </p>
          <p>Valid: {{ formatDate(promo.startDate) }} - {{ formatDate(promo.endDate) }}</p>
        </ion-label>
        <ion-badge slot="end" :color="promo.isActive ? 'success' : 'medium'">
          {{ promo.isActive ? 'Active' : 'Inactive' }}
        </ion-badge>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option @click="openEditPromotionModal(promo)" color="primary">
          <ion-icon slot="icon-only" :icon="pencilIcon"></ion-icon>
        </ion-item-option>

        <ion-item-option @click="togglePromotionStatus(promo)" :color="promo.isActive ? 'warning' : 'success'">
          <ion-icon slot="icon-only" :icon="promo.isActive ? eyeOffIcon : eyeIcon"></ion-icon>
        </ion-item-option>

         <ion-item-option @click="confirmRemovePromotion(promo)" color="danger">
          <ion-icon slot="icon-only" :icon="trashIcon"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openAddPromotionModal">
          <ion-icon :icon="addIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ currentPromotion.id ? 'Edit Promotion' : 'Add New Promotion' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="floating">Promotion Code *</ion-label>
            <ion-input v-model="currentPromotion.code" type="text" required :disabled="!!currentPromotion.id"></ion-input>
            <ion-note v-if="currentPromotion.id" slot="helper">Code cannot be changed after creation.</ion-note>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Description *</ion-label>
            <ion-textarea v-model="currentPromotion.description" auto-grow="true" required></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-label>Discount Type *</ion-label>
            <ion-select v-model="currentPromotion.discountType" interface="popover" placeholder="Select Type">
              <ion-select-option value="PERCENTAGE">Percentage</ion-select-option>
              <ion-select-option value="FIXED_AMOUNT">Fixed Amount</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Discount Value *</ion-label>
            <ion-input v-model.number="currentPromotion.discountValue" type="number" min="0" required></ion-input>
             <ion-note slot="helper">Enter % (e.g., 10) for Percentage, or amount (e.g., 25) for Fixed.</ion-note>
          </ion-item>
           <ion-item>
            <ion-label position="floating">Start Date *</ion-label>
            <ion-input v-model="currentPromotion.startDate" type="date" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">End Date *</ion-label>
            <ion-input v-model="currentPromotion.endDate" type="date" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>Is Active?</ion-label>
            <ion-toggle slot="end" v-model="currentPromotion.isActive"></ion-toggle>
          </ion-item>

          <ion-button expand="block" @click="handleSavePromotion" class="ion-margin-top" :disabled="isSaving">
            <ion-spinner v-if="isSaving" name="dots" slot="start"></ion-spinner>
            {{ currentPromotion.id ? 'Update Promotion' : 'Save Promotion' }}
          </ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon,
  IonModal, IonButton, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption, IonToggle, IonSpinner,
  IonBackButton, IonMenuButton, IonItemSliding, IonItemOptions, IonItemOption, IonBadge, IonNote, IonText,
  toastController, alertController,
} from '@ionic/vue';
import { addOutline as addIcon, pencilOutline as pencilIcon, trashOutline as trashIcon, eyeOutline as eyeIcon, eyeOffOutline as eyeOffIcon } from 'ionicons/icons';

interface Promotion {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  startDate: string; 
  endDate: string;   
  isActive: boolean;
}

const isLoading = ref(true);
const isSaving = ref(false);
const promotions = ref<Promotion[]>([]);
const isModalOpen = ref(false);

const initialPromotionState = (): Partial<Promotion> => ({
  id: undefined,
  code: '',
  description: '',
  discountType: 'PERCENTAGE',
  discountValue: 0,
  startDate: new Date().toISOString().split('T')[0], 
  endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], 
  isActive: true,
});
const currentPromotion = ref<Partial<Promotion>>(initialPromotionState());

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const fetchPromotionsFromAPI = async (): Promise<Promotion[]> => {
  console.log("Fetching promotions from API...");
  await new Promise(resolve => setTimeout(resolve, 700));
  return [
    { id: 'promo1', code: 'SUMMER20', description: '20% off summer bookings', discountType: 'PERCENTAGE', discountValue: 20, startDate: '2024-06-01', endDate: '2024-08-31', isActive: true },
    { id: 'promo2', code: 'SAVE50', description: '$50 off on bookings over $300', discountType: 'FIXED_AMOUNT', discountValue: 50, startDate: '2024-05-01', endDate: '2024-05-31', isActive: false },
  ];
};

const savePromotionToAPI = async (promoData: Promotion): Promise<Promotion> => {
  isSaving.value = true;
  console.log("Saving promotion to API:", promoData);
  await new Promise(resolve => setTimeout(resolve, 800));
  isSaving.value = false;
  const idToUse = promoData.id || `promo${Date.now()}`;
  return { ...promoData, id: idToUse } as Promotion;
};

const deletePromotionFromAPI = async (promoId: string): Promise<void> => {
  console.log("Deleting promotion with ID from API (simulated):", promoId);
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log("Promotion deleted from API successfully (simulated).");
};

onMounted(async () => {
  isLoading.value = true;
  try {
    promotions.value = await fetchPromotionsFromAPI();
  } catch (error) {
    console.error("Failed to fetch promotions:", error);
    const toast = await toastController.create({ message: 'Error loading promotions.', duration: 3000, color: 'danger' });
    toast.present();
  } finally {
    isLoading.value = false;
  }
});

const openAddPromotionModal = () => {
  currentPromotion.value = initialPromotionState();
  isModalOpen.value = true;
};

const openEditPromotionModal = (promoToEdit: Promotion) => {
  currentPromotion.value = { ...promoToEdit };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSavePromotion = async () => {
  if (!currentPromotion.value.code || !currentPromotion.value.description || !currentPromotion.value.discountType || currentPromotion.value.discountValue === undefined || currentPromotion.value.discountValue < 0 || !currentPromotion.value.startDate || !currentPromotion.value.endDate) {
    const toast = await toastController.create({ message: 'All required fields must be filled correctly.', duration: 2500, color: 'warning' });
    toast.present();
    return;
  }
  if (new Date(currentPromotion.value.endDate) < new Date(currentPromotion.value.startDate)) {
    const toast = await toastController.create({ message: 'End date cannot be before start date.', duration: 2500, color: 'warning' });
    toast.present();
    return;
  }

  try {
    const promoToSave: Promotion = {
      id: currentPromotion.value.id || `promo${Date.now()}`,
      code: currentPromotion.value.code!,
      description: currentPromotion.value.description!,
      discountType: currentPromotion.value.discountType!,
      discountValue: currentPromotion.value.discountValue!,
      startDate: currentPromotion.value.startDate!,
      endDate: currentPromotion.value.endDate!,
      isActive: currentPromotion.value.isActive === undefined ? true : currentPromotion.value.isActive,
    };

    const savedPromotion = await savePromotionToAPI(promoToSave);

    if (currentPromotion.value.id) {
      const index = promotions.value.findIndex(p => p.id === savedPromotion.id);
      if (index !== -1) {
        promotions.value[index] = savedPromotion;
      }
    } else {
      promotions.value.unshift(savedPromotion);
    }
    closeModal();
    const toast = await toastController.create({
        message: `Promotion successfully ${currentPromotion.value.id ? 'updated' : 'added'}.`,
        duration: 2000,
        color: 'success'
    });
    toast.present();
  } catch (error) {
    console.error("Failed to save promotion:", error);
    const toast = await toastController.create({ message: 'Error saving promotion.', duration: 3000, color: 'danger' });
    toast.present();
  } finally {
    isSaving.value = false;
  }
};

const togglePromotionStatus = async (promo: Promotion) => {
  const newStatus = !promo.isActive;
  const updatedPromoData = { ...promo, isActive: newStatus };

  try {
    const savedPromotion = await savePromotionToAPI(updatedPromoData); 
    const index = promotions.value.findIndex(p => p.id === savedPromotion.id);
    if (index !== -1) {
      promotions.value[index] = savedPromotion;
    }
    const toast = await toastController.create({
      message: `Promotion "${promo.code}" ${newStatus ? 'activated' : 'deactivated'}.`,
      duration: 2000,
      color: 'success',
    });
    await toast.present();
  } catch (error) {
     console.error("Failed to update promotion status:", error);
    const toast = await toastController.create({ message: 'Error updating promotion status.', duration: 3000, color: 'danger' });
    await toast.present();
  }
};

const confirmRemovePromotion = async (promoToRemove: Promotion) => {
  const alert = await alertController.create({
    header: 'Confirm Delete',
    message: `Are you sure you want to remove promotion "${promoToRemove.code}"?`,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Remove', cssClass: 'danger', handler: () => removePromotion(promoToRemove.id) },
    ],
  });
  await alert.present();
};

const removePromotion = async (promoId: string) => {
  try {
    await deletePromotionFromAPI(promoId);
    promotions.value = promotions.value.filter(p => p.id !== promoId);
    const toast = await toastController.create({ message: 'Promotion removed.', duration: 2000, color: 'success' });
    await toast.present();
  } catch (error) {
    console.error("Failed to remove promotion:", error);
    const toast = await toastController.create({ message: 'Error removing promotion.', duration: 3000, color: 'danger' });
    await toast.present();
  }
};

</script>

<style scoped>
ion-item-sliding ion-item-option {
  border-radius: 5px;
  margin: 2px;
}
</style>