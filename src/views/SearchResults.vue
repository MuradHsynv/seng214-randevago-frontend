<template>
    <ion-page>
        <ion-header :transluscent="true">
            <ion-toolbar color="none">
                <ion-buttons slot="start">
                    <ion-back-button
                        default-href="/"
                        text="Back"
                        style="color: var(--color-tetriary)"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title class="title">Randevago</ion-title>
                <ion-buttons slot="end">
                    <ion-button>
                        <ion-menu-button :auto-hide="false"></ion-menu-button>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content> </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>
import {
    IonPage,
    IonButton,
    IonToolbar,
    IonContent,
    IonHeader,
    IonButtons,
    IonMenuButton,
    IonTitle,
} from '@ionic/vue';
</script>

<style scoped>
.login-container {
    background: var(--ion-color-secondary);
    display: flex;
    flex-direction: column;
    margin-inline: 5%;
    padding-inline: 2%;
    border-radius: 25px;
}

ion-item::part(native) {
    background: transparent;
}

.lr-button {
    max-width: 40%;
    min-width: 30%;
}
.button-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    padding-left: 5px;
    width: 100%;
}

.login-register-toggle h2 {
    cursor: pointer;
    padding: 0 10px;
    color: grey;
    font-weight: normal;
}

.login-register-toggle h2.active {
    color: var(--color-title);
    font-weight: bold;
}
.login-register-toggle h2:first-child {
    border-right: 1px solid grey;
}

.login-register-toggle {
    display: flex;
    margin-bottom: 10px;
    padding-left: 5px;
}
.title {
    font-weight: bold;
    color: var(--color-title);
    align-self: center;
}
</style>
