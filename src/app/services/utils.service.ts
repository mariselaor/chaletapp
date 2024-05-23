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
    private modalController: ModalController 
  ) { }

  // Método para mostrar un cargador con un mensaje opcional
  async presentLoading(options: { message?: string } = {}) {
    const loading = await this.loadingCtrl.create({
      message: options.message || 'Cargando...' // Mensaje por defecto "Cargando..."
    });
    await loading.present(); // Presenta el cargador
  }

  // Método para ocultar el cargador
  async dismissLoading() {
    await this.loadingCtrl.dismiss(); // Oculta el cargador
  }

  // Método para mostrar un toast (notificación) con opciones configurables
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
    await toast.present(); // Presenta el toast
  }

  // Método para navegar a una ruta específica
  routerLink(url: string) {
    return this.router.navigateByUrl(url); // Navega a la URL especificada
  }

  // Métodos para interactuar con el LocalStorage

  setElementInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value)); // Guarda un valor en LocalStorage
  }

  getElementFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key)); // Obtiene un valor de LocalStorage
  }

  // Método para mostrar un modal con opciones configurables
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts); // Crea el modal con las opciones proporcionadas
    await modal.present(); // Presenta el modal

    const { data } = await modal.onWillDismiss(); // Espera hasta que el modal sea cerrado y obtiene los datos
    if (data) return data; // Retorna los datos si existen
  }

  // Método para cerrar un modal con datos opcionales
  dismissModal(data?: any) {
    this.modalController.dismiss(data); // Cierra el modal y pasa los datos opcionales
  }

  // Método para mostrar una alerta con opciones configurables
  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertController.create(opts); // Crea la alerta con las opciones proporcionadas
    await alert.present(); // Presenta la alerta
  }
}