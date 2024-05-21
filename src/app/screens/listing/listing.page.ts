import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Food } from 'src/app/models/food.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service'; 
import { AddProductComponent } from 'src/app/shared/components/add-product/add-product.component';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  categories: Category[] = [];
  foods: Food[] = [];
  filteredFoods: Food[] = [];
  searchTerm: string = '';
  user: User | null = null;  // Variable para almacenar la información del usuario

  constructor(
    private firebaseService: FirebaseService, 
    private router: Router,
    private utilsSvc: UtilsService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getCategoriesFromFirebase();
    this.getFoodsFromFirebase();
    this.getCurrentUser();  // Obtener la información del usuario actual
  }

  getCategoriesFromFirebase() {
    this.firebaseService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  getFoodsFromFirebase() {
    this.firebaseService.getFoodsFromService().subscribe((foods: Food[]) => {
      this.foods = foods;
      this.filteredFoods = foods; // Mostrar todos los alimentos al inicio
    });
  }

  filterFoods() {
    if (!this.searchTerm.trim()) {
      this.filteredFoods = this.foods; // Si no hay término de búsqueda, mostrar todos los productos
      return;
    }

    this.filteredFoods = this.foods.filter(food =>
      food.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goToDetailPage(id: string) {
    if (id && typeof id === 'string' && id.trim()) {
      this.router.navigate(['detail', id]);
    } else {
      console.error('ID de alimento no válido:', id);
    }
  }

  async openAddProductModal() {
    const modal = await this.modalController.create({
      component: AddProductComponent,
      cssClass: 'add-product-modal'
    });
    modal.onDidDismiss().then((data) => {
      if (data && data.data && data.data.newProduct) {
        const newProduct = data.data.newProduct;
        // Guardar el nuevo producto en Firebase y obtener el ID del documento
        this.firebaseService.addFood(newProduct).then((docId) => {
          // Asignar el ID del documento al nuevo producto localmente
          newProduct.id = docId;
          // Agregar el nuevo producto a la lista local de alimentos
          this.foods.push(newProduct);
          this.filteredFoods.push(newProduct); // Si es necesario
        })
      }
    });
    return await modal.present();
  }

  filterByCategory(category: Category | null) {
    if (!category) {
      this.filteredFoods = this.foods; // Mostrar todos los alimentos si no se selecciona una categoría
      return;
    }
    
    
    this.filteredFoods = this.foods.filter(food => food.categoryId === category.id);
  }

  getCurrentUser() {
    this.firebaseService.getCurrentUser().subscribe(
      (user: User | null) => {
        this.user = user;
      }
    );
  }
}  
