import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FoodItem } from 'src/app/models/food.model'; // Importa FoodItem en lugar de Food

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.scss']
})
export class FoodCardComponent {
  @Input() item: FoodItem;
  @Output() clicked = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();

  onClick() {
    if (this.item && this.item.id) {
      this.clicked.emit(this.item.id);
    }
  }
  
  deleteItem() {
    this.delete.emit();
  }
}
