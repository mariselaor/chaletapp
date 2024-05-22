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

  dismissModal() {
    this.modalController.dismiss();
  }

  hideProduct(productId: string) {
    this.modalController.dismiss({
      hideProductId: productId
    });
  }

  restoreProduct(productId: string) {
    this.modalController.dismiss({
      restoreProductId: productId
    });
  }
}
