<template>
    <ion-app>
        <ion-menu content-id="main-content" type="overlay" @ionWillOpen="checkAuthStatus">
            <ion-header :transluscent="true">
                <ion-toolbar color="primary">
                    <ion-title>Menu</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-menu-toggle :auto-hide="false">
                        <ion-item button @click="navigateTo('/search')">
                            <ion-icon slot="start" :icon="searchIcon"></ion-icon>
                            <ion-label>Search Hotels</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                    <ion-menu-toggle :auto-hide="false" v-if="isRegularUserLoggedInLocal && !isAdminLocal">
                        <ion-item button @click="navigateTo('/my-reservations')">
                            <ion-icon slot="start" :icon="listCircleIcon"></ion-icon>
                            <ion-label>My Reservations</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                    <ion-menu-toggle :auto-hide="false" v-if="isRegularUserLoggedInLocal && !isAdminLocal">
    <ion-item button @click="navigateTo('/user-hotels')">
        <ion-icon slot="start" :icon="businessIcon"></ion-icon>
        <ion-label>Hotels</ion-label>
    </ion-item>
</ion-menu-toggle>

                    <ion-menu-toggle :auto-hide="false" v-if="isUserLoggedInLocal">
                        <ion-item button @click="logout">
                            <ion-icon slot="start" :icon="logOutIcon"></ion-icon>
                            <ion-label>Log Out</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                    
                    <div v-if="isAdminLocal"> 
                        <ion-item-divider>
                            <ion-label>Admin Tools</ion-label>
                        </ion-item-divider>

                        <ion-menu-toggle :auto-hide="false">
                            <ion-item button @click="navigateTo('/admin/hotels')">
                                <ion-icon slot="start" :icon="businessIcon"></ion-icon>
                                <ion-label>Hotel Management</ion-label>
                            </ion-item>
                        </ion-menu-toggle>

                        <ion-menu-toggle :auto-hide="false">
                            <ion-item button @click="navigateTo('/admin/promotions')">
                                <ion-icon slot="start" :icon="pricetagIcon"></ion-icon>
                                <ion-label>Promotion Management</ion-label>
                            </ion-item>
                        </ion-menu-toggle>
                        <ion-menu-toggle :auto-hide="false">
                            <ion-item button @click="navigateTo('/admin/users')">
                                <ion-icon slot="start" :icon="peopleIcon"></ion-icon> 
                                <ion-label>User Management</ion-label>
                            </ion-item>
                        </ion-menu-toggle>
                        <ion-menu-toggle :auto-hide="false">
                            <ion-item button @click="navigateTo('/admin/reservations')">
                                <ion-icon slot="start" :icon="calendarIcon"></ion-icon> 
                                <ion-label>All Reservations</ion-label>
                            </ion-item>
                        </ion-menu-toggle>
                    </div>
                    
                    <ion-menu-toggle :auto-hide="false" v-if="!isUserLoggedInLocal">
                         <ion-item button @click="navigateTo('/login')">
                            <ion-icon slot="start" :icon="logInIcon"></ion-icon>
                            <ion-label>Login / Register</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                </ion-list>
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
  IonItemDivider
} from '@ionic/vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
    searchOutline as searchIcon,
    logInOutline as logInIcon,
    logOutOutline as logOutIcon, 
    businessOutline as businessIcon, 
    pricetagOutline as pricetagIcon, 
    peopleOutline as peopleIcon,
    listCircleOutline as listCircleIcon,
    calendarOutline as calendarIcon  
} from 'ionicons/icons';
import emitter from '@/emitter';

const isAdminLocal = ref(false); 
const isRegularUserLoggedInLocal = ref(false); 
const router = useRouter();

const isUserLoggedInLocal = computed(() => {
  return isAdminLocal.value || isRegularUserLoggedInLocal.value;
});

const checkAuthStatus = () => {
  isAdminLocal.value = localStorage.getItem('isAdmin') === 'true';
  isRegularUserLoggedInLocal.value = !!localStorage.getItem('userToken');
};

onMounted(() => {
  checkAuthStatus(); 
  emitter.on('authChange', checkAuthStatus);
});

onUnmounted(() => {
  emitter.off('authChange', checkAuthStatus);
});

const navigateTo = (path: string) => {
  router.push(path);
  menuController.close();
};

const logout = () => {
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('userToken');
  emitter.emit('authChange');
  router.push('/login');
  menuController.close();
};
</script>

<style scoped>
ion-item-divider {
    margin-top: 10px;
}
</style>