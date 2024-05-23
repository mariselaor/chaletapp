import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FoodItem } from 'src/app/models/food.model';

@Component({
  selector: 'app-hide-products-modal',
  templateUrl: './hide-products-modal.component.html',
  styleUrls: ['./hide-products-modal.component.scss'],
})
export class HideProductsModalComponent {
  @Input() foods: FoodItem[] = [];

  constructor(private modalController: ModalController) {}

  // Método para cerrar el modal
  dismissModal() {
    this.modalController.dismiss();
  }

  // Método para ocultar un producto y enviar el ID del producto oculto al componente padre
  hideProduct(productId: string) {
    this.modalController.dismiss({
      hideProductId: productId
    });
  }

  // Método para restaurar un producto y enviar el ID del producto restaurado al componente padre
  restoreProduct(productId: string) {
    this.modalController.dismiss({
      restoreProductId: productId
    });
  }
}
