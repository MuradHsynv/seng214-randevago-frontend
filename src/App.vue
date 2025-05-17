<template>
    <ion-app>
        <ion-menu content-id="main-content">
            <ion-header :transluscent="true">
                <ion-toolbar color="none">
                    <ion-title class="title">Menu</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-button v-if="isAdmin"
                    expand="full"
                    button @click="navigateTo('/admin/hotels')"
                    >Admin Panel</ion-button
                >
                <ion-button button @click="navigateTo('/search')" expand="full"
                    >Search</ion-button
                >
                <ion-button
                    expand="full"
                    button @click="logout"
                    routerDirection="forward"
                    >Log Out</ion-button
                >
            </ion-content>
        </ion-menu>
        <ion-router-outlet id="main-content" />
    </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  menuController,
} from '@ionic/vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { searchOutline as searchIcon, logInOutline as logInIcon, cogOutline as cogIcon, logOutOutline as logOutIcon } from 'ionicons/icons'; // Import icons

const isAdmin = ref(false);
const router = useRouter();
const route = useRoute(); 

const checkAdminStatus = () => {
  isAdmin.value = localStorage.getItem('isAdmin') === 'true';
};

onMounted(() => {
  checkAdminStatus(); 
});

const navigateTo = (path: string) => {
  router.push(path);
  menuController.close();
};

const logout = () => {
  localStorage.removeItem('isAdmin');
  isAdmin.value = false; 
  router.push('/login');
  menuController.close();
};
</script>
