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
                <ion-title class="title">Randevago</ion-title>
                <ion-buttons slot="end">
                    <ion-button>
                        <ion-menu-button :auto-hide="false"></ion-menu-button>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="login-container">
                <h2>Ankara, Türkiye</h2>
                17 Aug-22 Aug | 2 travelers, 1 room
                <div class="button-container">
                    <ion-icon
                        style="justify-self: flex-end"
                        slot="icon-only"
                        :icon="searchOutline"
                        size="large"
                    ></ion-icon>
                </div>
            </div>
                <div class="filters-container">
                    <ion-select interface="popover" label="Sort By" label-placement="floating" v-model="sortBy.popularity">
                        <ion-select-option value="popularity_desc">Popularity</ion-select-option>
                        <ion-select-option value="price_asc">Price: Low to High</ion-select-option>
                        <ion-select-option value="price_desc">Price: High to Low</ion-select-option>
                        <ion-select-option value="rating_desc">Rating: High to Low</ion-select-option>
                    </ion-select>
                </div>
            <div v-for="n in 5" :key="n">
                <ion-card @click="moveToDetails">
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
                    <ion-card-content>
                        Here's a small text description for the card content.
                        Nothing more, nothing less.
                    </ion-card-content>
                    <ion-card-content style="font-weight: bold">
                        255$
                    </ion-card-content>
                </ion-card>
            </div>
        </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>
import router from '@/router';
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
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonCardHeader,
    IonLabel,
} from '@ionic/vue';

import { searchOutline, star, starHalf } from 'ionicons/icons';
import { ref } from 'vue';

const moveToDetails = async () => {
    await router.push('/details');
};

const sortBy = ref({
    popularity: 'popularity_desc',
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
    color: var(--color-title);
}

ion-item::part(native) {
    background: transparent;
}

ion-select {
    padding-inline: 8px;
    width: 100%;
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

.title {
    font-weight: bold;
    color: var(--color-title);
    align-self: center;
}

.filters-container {
    display: flex;
    padding: 8px 16px;
    overflow-x: auto;
}
</style>
