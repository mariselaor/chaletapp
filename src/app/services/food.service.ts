import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { FoodItem } from '../models/food.model';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener todos los alimentos desde la colección 'foods' en Firestore
  getFoodsItems(): Observable<FoodItem[]> {
    return this.firestore.collection<FoodItem>('foods').valueChanges();
  }

  // Obtener un alimento específico por su ID desde la colección 'foods' en Firestore
  getFood(id: string): Observable<FoodItem> {
    return this.firestore.doc<FoodItem>(`foods/${id}`).valueChanges();
  }

  // Método para obtener un alimento por su ID
  // Llama internamente a getFood
  getFoodItemById(id: string): Observable<FoodItem> {
    return this.getFood(id);
  }

  // Actualizar un alimento existente en Firestore
  updateFood(food: FoodItem): Promise<void> {
    return this.firestore.doc(`foods/${food.id}`).update(food);
  }
}
