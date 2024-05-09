import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Food } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  constructor(private firestore: AngularFirestore) {}

  // Método para obtener todos los alimentos de Firestore
  getFoods(): Observable<Food[]> {
    return this.firestore.collection<Food>('foods').valueChanges();
  }

  // Método para obtener un alimento específico de Firestore
  getFood(id: string): Observable<Food | undefined> {
    return this.firestore.doc<Food>(`foods/${id}`).valueChanges();
  }
}
