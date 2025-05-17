<template>
    <ion-page>
        <ion-header :transluscent="true">
            <ion-toolbar color="none">
                <ion-buttons slot="start">
                    <ion-back-button
                        defaultHref="/search"
                        text="Back"
                        style="color: var(--color-tetriary)"
                    ></ion-back-button>
                </ion-buttons>
                <ion-buttons slot="end">
                    <ion-button>
                        <ion-menu-button :auto-hide="true"></ion-menu-button>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <h1 class="title">Randevago</h1>
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
                            v-model="loginEmail"
                            type="email"
                            placeholder="example@email.com"
                        ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Password</ion-label>
                        <ion-input
                            v-model="loginPassword"
                            type="password"
                            placeholder="********"
                        ></ion-input>
                    </ion-item>
                    <div class="button-container">
                        <ion-button
                            @click="handleLogin"
                            class="lr-button"
                            shape="round"
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
                        <ion-button
                            @click="handleRegister"
                            class="lr-button"
                            shape="round"
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
    IonMenuButton,
    toastController,
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import emitter from '@/emitter'; 

const login = ref(true);
const loginEmail = ref('');
const loginPassword = ref('');

const router = useRouter();

const handleLogin = async () => {
    if (loginEmail.value.toLowerCase() === 'admin' && loginPassword.value === 'password') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.removeItem('userToken'); 
        emitter.emit('authChange');
        const toast = await toastController.create({
            message: 'Admin login successful!',
            duration: 2000,
            color: 'success',
        });
        await toast.present();
        router.push('/admin/hotels');
    } else {
        localStorage.removeItem('isAdmin');
        if (loginEmail.value && loginPassword.value) { 
            localStorage.setItem('userToken', 'dummyRegularUserToken'); 
            emitter.emit('authChange');
            const toast = await toastController.create({
                message: 'Login successful! (Regular User)',
                duration: 2000,
                color: 'success',
            });
            await toast.present();
            router.push('/search');
        } else {
             const toast = await toastController.create({
                message: 'Invalid credentials or fields empty.',
                duration: 2000,
                color: 'danger',
            });
            await toast.present();
        }
    }
};

const handleRegister = async () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userToken');
    emitter.emit('authChange');
    const toast = await toastController.create({
        message: 'Registration successful! Please login.',
        duration: 2000,
        color: 'success'
    });
    await toast.present();
    login.value = true;
};
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
    margin-top: 40%;
    padding-left: 25px;
    font-weight: bold;
    color: var(--color-title);
    font-size: 40px;
}
</style>