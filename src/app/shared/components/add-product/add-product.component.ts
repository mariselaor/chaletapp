import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa tu servicio de Firebase
import { Food } from 'src/app/models/food.model'; // Importa tu modelo de alimento
import { Category } from 'src/app/models/category.model';
import { Subscription } from 'rxjs'; // Importa Subscription para gestionar las suscripciones

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  newFood = {
    title: '',
    price: null,
    description: '',
    categoryId: ''
  };

  categories: Category[] = []; // Inicializa la lista de categorías como vacía
  categoriesSubscription: Subscription; // Variable para gestionar la suscripción

  constructor(private modalController: ModalController, private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Cuando el componente se inicie, llama al método para obtener las categorías
    this.loadCategories();
  }

  loadCategories() {
    // Suscribe el Observable y maneja los datos cuando estén disponibles
    this.categoriesSubscription = this.firebaseService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories; // Asigna las categorías recibidas al arreglo
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  async addFood() {
    try {
      // Agregar la lógica para agregar el producto a la base de datos
      await this.firebaseService.addFood(this.newFood);
      console.log('Producto agregado exitosamente');
      this.modalController.dismiss();
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    // Al destruir el componente, nos aseguramos de desuscribirnos del Observable
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
