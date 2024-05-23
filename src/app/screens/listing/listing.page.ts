import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { FoodItem } from 'src/app/models/food.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddProductComponent } from 'src/app/shared/components/add-product/add-product.component';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { HideProductsModalComponent } from 'src/app/shared/components/hide-products-modal/hide-products-modal.component';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  categories: Category[] = [];
  foods: FoodItem[] = [];
  filteredFoods: FoodItem[] = [];
  searchTerm: string = '';
  user: User | null = null;  // Variable para almacenar la información del usuario

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private utilsSvc: UtilsService,
    private modalController: ModalController
  ) { }

  // Método ngOnInit que se ejecuta al inicializar el componente
  ngOnInit() {
    this.getCategoriesFromFirebase();
    this.getFoodsFromFirebase();
    this.getCurrentUser();  // Obtener la información del usuario actual
  }

  // Método para obtener las categorías desde Firebase
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

  // Método para obtener los alimentos desde Firebase
  getFoodsFromFirebase() {
    this.firebaseService.getFoodsFromService().subscribe((foods: FoodItem[]) => {
      this.foods = foods;
      this.filteredFoods = foods.filter(food => !food.hidden); // Mostrar solo alimentos no ocultos al inicio
    });
  }

  // Método para filtrar los alimentos en función del término de búsqueda
  filterFoods() {
    if (!this.searchTerm.trim()) {
      this.filteredFoods = this.foods.filter(food => !food.hidden); // Si no hay término de búsqueda, mostrar todos los productos no ocultos
      return;
    }

    this.filteredFoods = this.foods.filter(food =>
      food.title.toLowerCase().includes(this.searchTerm.toLowerCase()) && !food.hidden
    );
  }

  // Método para navegar a la página de detalles del alimento
  goToDetailPage(id: string) {
    if (id && typeof id === 'string' && id.trim()) {
      this.router.navigate(['detail', id]);
    } else {
      console.error('ID de alimento no válido:', id);
    }
  }

  // Método para abrir el modal de añadir producto
  async openAddProductModal() {
    const modal = await this.modalController.create({
      component: AddProductComponent,
      cssClass: 'add-product-modal'
    });
    modal.onDidDismiss().then((data) => {
      if (data && data.data && data.data.newProduct) {
        const newProduct = data.data.newProduct;
        // Guardar el nuevo producto en Firebase y obtener el ID del documento
        this.firebaseService.addFood(newProduct).then(() => {
          // Agregar el nuevo producto a la lista local de alimentos
          this.foods.push(newProduct);
          if (!newProduct.hidden) {
            this.filteredFoods.push(newProduct); // Si es necesario
          }
        });
      }
    });
    return await modal.present();
  }

  // Método para filtrar alimentos por categoría
  filterByCategory(category: Category | null) {
    if (!category) {
      this.filteredFoods = this.foods.filter(food => !food.hidden); // Mostrar todos los alimentos no ocultos si no se selecciona una categoría
      return;
    }

    this.filteredFoods = this.foods.filter(food => food.categoryId === category.id && !food.hidden);
  }

  // Método para obtener la información del usuario actual
  getCurrentUser() {
    this.firebaseService.getCurrentUser().subscribe(
      (user: User | null) => {
        this.user = user;
      }
    );
  }

  // Método para ocultar un producto (solo disponible para administradores)
  hideProduct(productId: string) {
    if (this.user && this.user.role === 'Administrador') {
      const product = this.foods.find(food => food.id === productId);
      if (product) {
        product.hidden = true; // Marcar el producto como oculto
        this.firebaseService.updateFood(product.id, { hidden: true }).then(() => {
          this.filteredFoods = this.foods.filter(food => !food.hidden);
        });
      }
    } else {
      console.error('Usuario no autorizado para ocultar productos.');
    }
  }

  // Método para restaurar un producto oculto (solo disponible para administradores)
  restoreProduct(productId: string) {
    if (this.user && this.user.role === 'Administrador') {
      const product = this.foods.find(food => food.id === productId);
      if (product) {
        product.hidden = false; // Marcar el producto como no oculto
        this.firebaseService.updateFood(product.id, { hidden: false }).then(() => {
          this.filteredFoods = this.foods.filter(food => !food.hidden);
        });
      }
    } else {
      console.error('Usuario no autorizado para mostrar productos.');
    }
  }

  // Método para abrir el modal de ocultar productos
  async openHideProductsModal() {
    const modal = await this.modalController.create({
      component: HideProductsModalComponent,
      componentProps: {
        foods: this.foods
      }
    });

    modal.onDidDismiss().then((detail) => {
      if (detail.data) {
        if (detail.data.hideProductId) {
          this.hideProduct(detail.data.hideProductId);
        }
        if (detail.data.restoreProductId) {
          this.restoreProduct(detail.data.restoreProductId);
        }
      }
    });

    await modal.present();
  }
}