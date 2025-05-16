<template>
    <ion-page>
        <ion-header :transluscent="true">
            <ion-toolbar color="none">
                <ion-title class="title">Randevago</ion-title>
                <ion-buttons slot="end">
                    <ion-button>
                        <ion-menu-button :auto-hide="true"></ion-menu-button>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-item>
                    <ion-select label="Where to?" label-placement="floating">
                        <ion-select-option value="Ankara"
                            >Ankara</ion-select-option
                        >
                        <ion-select-option value="Adana"
                            >Adana</ion-select-option
                        >
                        <ion-select-option value="Izmir"
                            >İzmir</ion-select-option
                        >
                        <ion-select-option value="Istanbul"
                            >İstanbul</ion-select-option
                        >
                        <ion-select-option value="Antalya"
                            >Antalya</ion-select-option
                        >
                    </ion-select>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Travelers</ion-label>
                    <ion-input type="number"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Rooms</ion-label>
                    <ion-input type="number"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Start Date</ion-label>
                    <ion-datetime-button
                        datetime="starttime"
                    ></ion-datetime-button>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Finish Date</ion-label>
                    <ion-datetime-button
                        datetime="endtime"
                    ></ion-datetime-button>
                </ion-item>
            </ion-list>
            <ion-button
                routerLink="/results"
                routerDirection="forward"
                class="lr-button"
                >Search</ion-button
            >
        </ion-content>
        <ion-modal :keep-contents-mounted="true">
            <ion-datetime id="starttime" presentation="date" />
            <ion-datetime id="endtime" presentation="date" />
        </ion-modal>
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
    IonItem,
    IonSelect,
    IonList,
    IonSelectOption,
    IonInput,
    IonLabel,
    IonDatetime,
    IonModal,
    IonDatetimeButton,
} from '@ionic/vue';
</script>

<style scoped>
.number-container {
    display: flex;
    flex-direction: row;
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
