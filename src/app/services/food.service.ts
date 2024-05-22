import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { FoodItem } from '../models/food.model';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private firestore: AngularFirestore) {}

  getFoodsItems(): Observable<FoodItem[]> {
    return this.firestore.collection<FoodItem>('foods').valueChanges();
  }

  getFood(id: string): Observable<FoodItem> {
    return this.firestore.doc<FoodItem>(`foods/${id}`).valueChanges();
  }

  getFoodItemById(id: string): Observable<FoodItem> {
    return this.getFood(id);
  }
}
