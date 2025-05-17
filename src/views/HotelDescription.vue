<template>
    <ion-page>
        <ion-header :transluscent="true">
            <ion-toolbar color="none">
                <ion-buttons slot="start">
                    <ion-back-button
                        defaultHref="/results"
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
        <ion-content>
            <img
                alt="Silhouette of mountains"
                src="https://ionicframework.com/docs/img/demos/card-media.png"
            />
            <ion-card-header>
                <ion-card-title>Hotel Title</ion-card-title>
                <ion-card-subtitle>
                    <ion-icon
                        v-for="n in 4"
                        :key="n"
                        :icon="star"
                        size="small"
                    />
                    <ion-icon :icon="starHalf" size="small" />
                </ion-card-subtitle>
            </ion-card-header>
            <div class="button-container">
                <ion-button id="open-toast" class="lr-button"
                    >Reserve for 255$ per night</ion-button
                >
            </div>
            <ion-toast
                color="success"
                trigger="open-toast"
                position="middle"
                message="Reservation successful"
                :duration="5000"
            />
            <ion-segment>
                <ion-segment-button value="overview" content-id="first">
                    <ion-label>Overview</ion-label>
                </ion-segment-button>
                <ion-segment-button value="about" content-id="second">
                    <ion-label>About</ion-label>
                </ion-segment-button>
                <ion-segment-button value="rooms" content-id="third">
                    <ion-label>Rooms</ion-label>
                </ion-segment-button>
            </ion-segment>
            <ion-segment-view>
                <ion-segment-content id="first">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </ion-segment-content>
                <ion-segment-content id="second">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                    <ion-title style="padding-left: 3px; font-weight: bold; margin-top: 15px;">Location</ion-title>
                    <div style="padding: 10px; height: 300px; width: 100%;">
                        <l-map ref="mapRef" v-model:zoom="zoom" :center="[47.41322, -1.219482]">
                            <l-tile-layer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                layer-type="base"
                                name="OpenStreetMap"
                            ></l-tile-layer>
                        </l-map>
                    </div>
                </ion-segment-content>

                <ion-segment-content id="third"
                    >Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.</ion-segment-content
                >
            </ion-segment-view>
        </ion-content>
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
    IonBackButton,
    IonTitle,
    IonIcon,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonSegmentContent,
    IonToast,
} from '@ionic/vue';
import L from 'leaflet'; 
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { star, starHalf } from 'ionicons/icons';
import { ref, nextTick, onMounted } from 'vue';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const zoom = ref(15);
const mapRef = ref(null);

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});
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