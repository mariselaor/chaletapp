import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { FoodItem } from '../models/food.model';
import { Category } from '../models/category.model';
import { FoodService } from './food.service';
import { CartService } from './cart.service';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private auth: AngularFireAuth,
    private foodService: FoodService,
    private cartService: CartService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  //=========== ACCEDER ==============
  // Obtener la instancia de autenticación de Firebase
  getAuth() {
    return getAuth();
  }
  
  // Iniciar sesión con correo y contraseña
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ========= REGISTRAR ===============
  // Registrar un nuevo usuario con correo y contraseña
  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(getAuth(), email, password);
  }

  // ========= ACTUALIZAR USUARIO ===============
  // Actualizar el perfil del usuario
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // Obtener el usuario actual autenticado
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

  // Obtener el estado de autenticación
  getAuthState() {
    return this.auth.authState;
  }

  // Cerrar sesión del usuario
  async signOut() {
    await this.auth.signOut();
    this.router.navigateByUrl('/auth');
    localStorage.removeItem('user');
  }

  // Métodos para alimentos

  // Obtener todos los alimentos desde Firestore
  getFoodsFromFirestore(): Observable<FoodItem[]> {
    return this.firestore.collection<FoodItem>('foods').valueChanges();
  }

  // Métodos para categorías

  // Obtener todas las categorías desde Firestore
  getCategories(): Observable<Category[]> {
    return this.firestore.collection<Category>('categories').valueChanges();
  }

  // Método para agregar un nuevo alimento
  addFood(newFood: FoodItem): Promise<void> {
    return this.firestore.collection('foods').doc(newFood.id).set(newFood);
  }

  // Métodos para el carrito

  // Agregar un alimento al carrito
  addToCart(item: FoodItem) {
    const cartItem: CartItem = {
      id: item.id.toString(),
      name: item.title,
      quantity: 1,
      price: item.price,
      image: item.image
    };
    this.cartService.addToCart(cartItem);
  }

  // Método para establecer un documento en Firestore
  setDocument(path: string, data: any) {
    return this.firestore.doc(path).set(data);
  }

  //==== Obtener un documento específico de Firestore ====
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  
  // Métodos para alimentos desde el servicio

  // Obtener alimentos desde el servicio FoodService
  getFoodsFromService(): Observable<FoodItem[]> {
    return this.foodService.getFoodsItems();
  }

  // Eliminar un alimento específico de Firestore
  deleteFoodFromFirestore(id: string): Promise<void> {
    return this.firestore.doc(`foods/${id}`).delete();
  }

  // Obtener un alimento específico desde el servicio FoodService
  getFoodFromService(id: string): Observable<FoodItem | undefined> {
    return this.foodService.getFood(id);
  }

  // Método para subir imágenes a Firestore Storage y obtener la URL de descarga
  uploadImageAndGetURL(file: File, filePath: string): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return from(task).pipe(
      switchMap(() => fileRef.getDownloadURL())
    );
  } 

  // Método para actualizar un alimento en Firestore
  updateFood(id: string, data: Partial<FoodItem>): Promise<void> {
    return this.firestore.collection('foods').doc(id).update(data);
  }

  // Método para registrar un nuevo pedido en la base de datos
  registerOrder(orderDetails: any): Promise<any> {
    return this.firestore.collection('pedidos').add(orderDetails);
  }
}
