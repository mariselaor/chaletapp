import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Food } from 'src/app/models/food.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service'; 
import { AddProductComponent } from 'src/app/shared/components/add-product/add-product.component';
import { ModalController } from '@ionic/angular';

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

  constructor(private firebaseService: FirebaseService, 
              private router: Router,
              private utilsSvc: UtilsService,
              private modalController: ModalController) { } // Inyecta ModalController en el constructor

  ngOnInit() {
    this.getCategoriesFromFirebase();
    this.getFoodsFromFirebase();
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
      component: AddProductComponent, // Componente modal para agregar producto
      cssClass: 'add-product-modal' 
    });
    return await modal.present();
  }

  filterByCategory(category: Category | null) {
    if (!category) {
      this.filteredFoods = this.foods; // Mostrar todos los alimentos si no se selecciona una categoría
      return;
    }
    
    console.log('Categoria seleccionada:', category);
    
    this.filteredFoods = this.foods.filter(food => food.categoryId === category.id);
    console.log('Alimentos filtrados:', this.filteredFoods);
  }
  
  
}
