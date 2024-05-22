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
import jsPDF from 'jspdf';
import { CartItem } from '../models/cart-item.model';
import autoTable from 'jspdf-autotable';

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

  getAuthState() {
    return this.auth.authState;
  }

  async signOut() {
    await this.auth.signOut();
    this.router.navigateByUrl('/auth');
    localStorage.removeItem('user');
  }

  // Métodos para alimentos

  getFoodsFromFirestore(): Observable<FoodItem[]> {
    return this.firestore.collection<FoodItem>('foods').valueChanges();
  }

  // Métodos para categorías

  getCategories(): Observable<Category[]> {
    return this.firestore.collection<Category>('categories').valueChanges();
  }

  // Método para agregar alimentos
  addFood(newFood: FoodItem): Promise<void> {
    return this.firestore.collection('foods').doc(newFood.id).set(newFood);
  }

  // Métodos para el carrito

  addToCart(item: FoodItem) {
    const cartItem = {
      id: item.id.toString(),
      name: item.title,
      quantity: 1,
      price: item.price,
      image: item.image
    };
    this.cartService.addToCart(cartItem);
  }

  // Método para establecer un documento

  setDocument(path: string, data: any) {
    return this.firestore.doc(path).set(data);
  }

  //==== Obtener un documento ====
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  
  // Métodos para alimentos desde el servicio
  getFoodsFromService(): Observable<FoodItem[]> {
    return this.foodService.getFoodsItems();
  }

  deleteFoodFromFirestore(id: string): Promise<void> {
    return this.firestore.doc(`foods/${id}`).delete();
  }

  getFoodFromService(id: string): Observable<FoodItem | undefined> {
    return this.foodService.getFood(id);
  }

   // Método para subir imágenes y obtener la URL de descarga
uploadImageAndGetURL(file: File, filePath: string): Observable<string> {
  const fileRef = this.storage.ref(filePath);
  const task = this.storage.upload(filePath, file);

  return from(task).pipe(
    switchMap(() => fileRef.getDownloadURL())
  );
} 

  //PDF TICKET
  generatePdf(cartItems: CartItem[], total: number) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297] 
    });
    
    doc.setFontSize(12);
    doc.text('Ticket de Compra', 14, 10);

    const tableData = cartItems.map(item => [item.name, item.quantity, `$${item.price.toFixed(2)}`]);
    const tableColumnStyles: { [key: string]: Partial<any> } = {
      0: { halign: 'left' }, 
      2: { halign: 'right' }
    };
    const tableHead = [['Producto', 'Cantidad', 'Precio']];
    const tableBody = tableData;

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: 20,
      theme: 'plain',
      headStyles: {
        fillColor: [0, 57, 107],
        textColor: [255, 255, 255],
        halign: 'center',
      },
      styles: {
        fontSize: 10,
        halign: 'center',
        cellPadding: 2,
      },
      columnStyles: tableColumnStyles,
      didDrawPage: (data) => {
        doc.setFontSize(12);
        doc.text(`Total: $${total.toFixed(2)}`, 14, data.cursor.y + 10);
      }
    });

    doc.save('ticket_compra.pdf');
  }
}
