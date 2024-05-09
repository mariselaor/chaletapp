import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from '../models/food.model';
import { Category } from '../models/category.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FoodService } from './food.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: AngularFireAuth,
    private foodService: FoodService,
    private cartService: CartService,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  // Métodos de autenticación
  getUserData(uid: string): Observable<any> {
    return this.firestore.doc(`users/${uid}`).valueChanges();
  }

  getAuth() {
    return this.auth;
  }

  login(user: any) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signUp(user: any) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  async updateUser(user: any) {
    try {
      const userRef = this.firestore.collection('users').doc(user.uid);
      await userRef.update(user);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  }

  getAuthState() {
    return this.auth.authState;
  }

  async signOut() {
    await this.auth.signOut();
    this.router.navigateByUrl('/auth');
    localStorage.removeItem('user');
  }

  // Métodos para alimentos
  getFoodsFromFirestore(): Observable<Food[]> {
    return this.firestore.collection<Food>('foods').valueChanges();
  }

  // Métodos para categorías
  getCategoriesFromFirestore(): Observable<Category[]> {
    return this.firestore.collection<Category>('categories').valueChanges();
  }

  addCategoryToFirestore(category: Category) {
    return this.firestore.collection<Category>('categories').doc(category.id).set(category);
  }

  getCategories(): Observable<Category[]> {
    return this.firestore.collection<Category>('categories').valueChanges();
  }

  // Métodos para el carrito
  addToCart(item: Food) {
    const cartItem = {
      id: item.id.toString(),
      name: item.title,
      quantity: 1,
      price: item.price,
      image: item.image
    };
    this.cartService.addToCart(cartItem);
  }

  // Métodos adicionales para Firestore
  getFirestore() {
    return this.firestore;
  }

  setDocument(path: string, data: any) {
    return this.getFirestore().collection(path).doc(path).set(data);
  }

  // Métodos para alimentos desde el servicio
  getFoodsFromService(): Observable<Food[]> {
    return this.foodService.getFoods();
  }

  getFoodFromService(id: string): Observable<Food | undefined> {
    return this.foodService.getFood(id);
  }

  // Métodos para alimentos en Firestore
  addFoodToFirestore(food: Food) {
    return this.firestore.collection<Food>('foods').add(food);
  }

  deleteFoodFromFirestore(id: string): Promise<void> {
    return this.firestore.doc(`foods/${id}`).delete();
  }
  async addFood(food: Food): Promise<void> {
    try {
      await this.firestore.collection('foods').add(food);
    } catch (error) {
      console.error('Error al agregar alimento:', error);
      throw error; // Puedes manejar el error según tu lógica de aplicación
    }
  }
}

