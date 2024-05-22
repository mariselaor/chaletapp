import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController, AlertOptions, ModalController, ModalOptions } from '@ionic/angular'; // Asegúrate de importar ModalController
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController // Inyecta ModalController
  ) { }

  async presentLoading(options: { message?: string } = {}) {
    const loading = await this.loadingCtrl.create({
      message: options.message || 'Cargando...'
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }

  async presentToast(options: { message: string, duration?: number, color?: string, icon?: string }) {
    const toast = await this.toastCtrl.create({
      message: options.message,
      duration: options.duration || 2000,
      color: options.color || 'primary',
      position: 'bottom',
      buttons: [
        {
          icon: options.icon || '',
          side: 'start'
        }
      ]
    });
    await toast.present();
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  setElementInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getElementFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    this.modalController.dismiss(data);
  }

  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertController.create(opts);
    await alert.present();
  }
}
