<template>
    <ion-app>
        <ion-menu content-id="main-content">
            <ion-header :transluscent="true">
                <ion-toolbar color="none">
                    <ion-title class="title">Menu</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-button routerLink="/" expand="full">Search</ion-button>
                <ion-button
                    expand="full"
                    routerLink="/login"
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
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
} from '@ionic/vue';
</script>
