import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Food } from 'src/app/models/food.model';

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.scss']
})
export class FoodCardComponent {
  @Input() item: Food; // Asegúrate de que el tipo sea 'Food'
  @Output() clicked = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>(); // Quitamos el parámetro del EventEmitter

  onClick() {
    if (this.item && this.item.id) {
      this.clicked.emit(this.item.id);
    }
  }
  
  deleteItem() {
    this.delete.emit(); // Eliminamos el parámetro del emit
  }
}
