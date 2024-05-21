import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Food } from '../models/food.model';
import { Category } from '../models/category.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FoodService } from './food.service';
import { CartService } from './cart.service';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from '../models/user.model';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';

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

  //=========== ACCEDER ==============
  getAuth() {
    return getAuth();
  }
  
  //=========== ACCEDER ==============
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ========= REGISTRAR ===============
  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(getAuth(), email, password);
  }

  // ========= ACTUALIZAR USUARIO ===============
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  getCurrentUser(): Observable<User | null> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
  

  getAuthState(): Observable<any> {
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

  //==== Obtener un documento ====
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  setDocument(path: string, data: any) {
    return this.firestore.doc(path).set(data);
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

  addFood(newProduct: Food): Promise<void> {
    return this.firestore.collection('foods').doc(newProduct.id).set(newProduct);
  }
}
