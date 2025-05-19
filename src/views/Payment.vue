<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Payment</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="goBack" style="color: var(--color-tetriary);">
  Back
</ion-button>

        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>Payment Information</h2>
      <ion-item>
        <ion-label position="floating">Cardholder Name</ion-label>
        <ion-input v-model="cardholderName" />
      </ion-item>
      <ion-item>
        <ion-label position="floating">Card Number</ion-label>
        <ion-input v-model="cardNumber" type="number" />
      </ion-item>
      <ion-item>
        <ion-label position="floating">Expiration Date</ion-label>
        <ion-input v-model="expiry" placeholder="MM/YY" />
      </ion-item>
      <ion-item>
        <ion-label position="floating">CVV</ion-label>
        <ion-input v-model="cvv" type="number" />
      </ion-item>
       
      <ion-button expand="block" color="success" style="margin-top: 20px;" @click="confirmPayment">
        Confirm
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonButtons
} from '@ionic/vue';

const router = useRouter();

const cardholderName = ref('');
const cardNumber = ref('');
const expiry = ref('');
const cvv = ref('');

const confirmPayment = () => {
  alert('Payment confirmed!');
  router.push('/user-hotels');
};

const goBack = () => {
  router.back();
};
</script>
