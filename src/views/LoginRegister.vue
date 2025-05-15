<template>
    <ion-page>
        <ion-header :transluscent="true">
            <ion-toolbar color="none">
                <ion-buttons slot="start">
                    <ion-back-button
                        default-href="/"
                        text="Back"
                        style="color:var(--color-tetriary);"
                    ></ion-back-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="login-container">
                <div class="login-register-toggle">
                    <h2 @click="login = true" :class="{ active: login }">
                        Login
                    </h2>
                    <h2 @click="login = false" :class="{ active: !login }">
                        Register
                    </h2>
                </div>
                <div v-if="login">
                    <ion-item>
                        <ion-label position="stacked">Email</ion-label>
                        <ion-input
                            type="email"
                            placeholder="example@email.com"
                        ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Password</ion-label>
                        <ion-input
                            type="password"
                            placeholder="********"
                        ></ion-input>
                    </ion-item>
                    <div class="button-container">
                        <ion-button class="lr-button" shape="round"
                            >Login</ion-button
                        >
                    </div>
                </div>
                <div v-else>
                    <ion-item>
                        <ion-label position="stacked">Name</ion-label>
                        <ion-input
                            type="text"
                            placeholder="Name"
                        ></ion-input> </ion-item
                    ><ion-item>
                        <ion-label position="stacked">Surname</ion-label>
                        <ion-input
                            type="text"
                            placeholder="Surname"
                        ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Phone Number</ion-label>
                        <ion-input
                            type="number"
                            placeholder="(5XX)XXXXXXX"
                        ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Email</ion-label>
                        <ion-input
                            type="email"
                            placeholder="example@email.com"
                        ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Password</ion-label>
                        <ion-input
                            type="password"
                            placeholder="********"
                        ></ion-input>
                    </ion-item>
                    <div class="button-container">
                        <ion-button class="lr-button" shape="round"
                            >Register</ion-button
                        >
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>
import {
    IonInput,
    IonPage,
    IonButton,
    IonToolbar,
    IonContent,
    IonHeader,
    IonBackButton,
    IonButtons,
    IonItem,
    IonLabel,
} from '@ionic/vue';
import LRTabs from './LRTabs.vue';
import { ref } from 'vue';
const login = ref(true);
</script>
<style scoped>
.login-container {
    background: var(--ion-color-secondary);
    display: flex;
    flex-direction: column;
    margin-top: 25%;
    margin-inline: 10%;
    padding-inline: 2%;
    padding-bottom: 1%;
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
</style>
