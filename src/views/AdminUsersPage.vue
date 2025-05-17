<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/admin/hotels" text="Back" style="color: var(--color-tetriary)"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">User Management</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button :auto-hide="false"></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">User Management</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="isLoading" class="ion-text-center ion-padding">
        <ion-spinner></ion-spinner>
        <p>Loading users...</p>
      </div>

      <ion-list v-else-if="users.length > 0">
        <ion-item-sliding v-for="user in users" :key="user.id">
          <ion-item>
            <ion-label>
              <h2>{{ user.name }} {{ user.surname }} ({{ user.role }})</h2>
              <p>{{ user.email }}</p>
              <p>Phone: {{ user.phoneNumber || 'N/A' }}</p>
            </ion-label>
            <ion-badge :color="user.isActive ? 'success' : 'medium'" slot="end">
              {{ user.isActive ? 'Active' : 'Disabled' }}
            </ion-badge>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="primary" @click="openEditUserModal(user)">
              <ion-icon :icon="pencilIcon" slot="icon-only"></ion-icon>
            </ion-item-option>
            <ion-item-option :color="user.isActive ? 'warning' : 'success'" @click="toggleUserStatus(user)">
               <ion-icon :icon="user.isActive ? banIcon : checkmarkCircleIcon" slot="icon-only"></ion-icon>
            </ion-item-option>
            <ion-item-option color="danger" @click="confirmDeleteUser(user)">
              <ion-icon :icon="trashIcon" slot="icon-only"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <div v-else class="ion-text-center ion-padding">
        <p>No users found (besides the implicit admin).</p>
      </div>

      <ion-modal :is-open="isUserModalOpen" @didDismiss="closeUserModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Edit User: {{ editingUser.name }}</ion-title>
            <ion-buttons slot="end"><ion-button @click="closeUserModal">Close</ion-button></ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-item>
                <ion-label position="stacked">Name</ion-label>
                <ion-input v-model="editingUser.name"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Surname</ion-label>
                <ion-input v-model="editingUser.surname"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Email</ion-label>
                <ion-input v-model="editingUser.email" type="email" readonly></ion-input>
                <ion-note slot="helper">Email cannot be changed.</ion-note>
            </ion-item>
             <ion-item>
                <ion-label position="stacked">Phone Number</ion-label>
                <ion-input v-model="editingUser.phoneNumber" type="tel"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label>Role</ion-label>
                <ion-select v-model="editingUser.role" interface="popover">
                    <ion-select-option value="GUEST">Guest</ion-select-option>
                    <ion-select-option value="ADMIN">Admin</ion-select-option>
                    <ion-select-option value="HotelOwner">Hotel Owner</ion-select-option>
                </ion-select>
            </ion-item>
             <ion-item>
                <ion-label>Account Active?</ion-label>
                <ion-toggle v-model="editingUser.isActive" slot="end"></ion-toggle>
            </ion-item>
            <ion-button expand="block" @click="handleUpdateUser" class="ion-margin-top" :disabled="isProcessingUser">
                 <ion-spinner v-if="isProcessingUser" name="dots" slot="start"></ion-spinner>
                Update User
            </ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonBadge,
    IonButtons, IonBackButton, IonMenuButton, IonSpinner, IonItemSliding, IonItemOptions, IonItemOption,
    IonModal, IonInput, IonSelect, IonSelectOption, IonToggle, IonButton, IonNote,
    toastController, alertController
} from '@ionic/vue';
import { pencilOutline as pencilIcon, trashOutline as trashIcon, banOutline as banIcon, checkmarkCircleOutline as checkmarkCircleIcon } from 'ionicons/icons';

interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    phoneNumber?: string;
    role: 'GUEST' | 'ADMIN' | 'HOTEL_OWNER'; 
    isActive: boolean;
}

const isLoading = ref(true);
const users = ref<User[]>([]);
const isUserModalOpen = ref(false);
const editingUser = reactive<Partial<User>>({});
const isProcessingUser = ref(false);

const mockUsers: User[] = [ 
    { id: 'usr1', name: 'John', surname: 'Doe', email: 'john.doe@example.com', phoneNumber: '5551234567', role: 'GUEST', isActive: true },
    { id: 'usr2', name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com', role: 'GUEST', isActive: false },
];

const fetchUsers = async () => {
    isLoading.value = true;
    console.log("Fetching users (simulated)...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    users.value = [...mockUsers]; 
    isLoading.value = false;
};

onMounted(fetchUsers);

const openEditUserModal = (user: User) => {
    Object.assign(editingUser, user); 
    isUserModalOpen.value = true;
};

const closeUserModal = () => {
    isUserModalOpen.value = false;
    Object.keys(editingUser).forEach(key => delete editingUser[key as keyof User]); 
};

const handleUpdateUser = async () => {
    if (!editingUser.id) return;
    isProcessingUser.value = true;
    console.log("Updating user (simulated):", editingUser);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const index = users.value.findIndex(u => u.id === editingUser.id);
    if (index !== -1) {
        users.value[index] = { ...users.value[index], ...editingUser } as User;
    }
    isProcessingUser.value = false;
    closeUserModal();
    const toast = await toastController.create({ message: 'User updated successfully.', duration: 2000, color: 'success' });
    await toast.present();
};

const toggleUserStatus = async (user: User) => {
    const newStatus = !user.isActive;
    console.log(`Toggling status for ${user.email} to ${newStatus ? 'Active' : 'Disabled'} (simulated)`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users.value[index].isActive = newStatus;
    }
     const toast = await toastController.create({ message: `User ${newStatus ? 'enabled' : 'disabled'}.`, duration: 2000, color: 'success' });
    await toast.present();
};

const confirmDeleteUser = async (user: User) => {
    if (user.email.toLowerCase() === 'admin') { 
        const toast = await toastController.create({ message: 'The primary admin account cannot be deleted.', duration: 3000, color: 'warning' });
        await toast.present();
        return;
    }
    const alert = await alertController.create({
        header: 'Confirm Delete',
        message: `Are you sure you want to delete user ${user.name} ${user.surname} (${user.email})?`,
        buttons: [
            { text: 'Cancel', role: 'cancel' },
            { text: 'Delete', cssClass: 'danger', handler: () => deleteUser(user.id) }
        ]
    });
    await alert.present();
};

const deleteUser = async (userId: string) => {
    console.log("Deleting user (simulated):", userId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    users.value = users.value.filter(u => u.id !== userId);
    const toast = await toastController.create({ message: 'User deleted successfully.', duration: 2000, color: 'success' });
    await toast.present();
};

</script>

<style scoped>
</style>