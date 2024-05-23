import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FoodItem } from 'src/app/models/food.model';
import { Category } from 'src/app/models/category.model';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  newFood: FoodItem = {
    id: '',
    title: '',
    price: null,
    description: '',
    categoryId: '',
    image: '',
    selected: false
  };

  categories: Category[] = [];
  categoriesSubscription: Subscription;
  image: any;
  imageFile: File;
  imageSelected: boolean = false;

  constructor(private modalController: ModalController, private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadCategories();
  }

  // Método para cargar las categorías desde Firebase
  loadCategories() {
    this.categoriesSubscription = this.firebaseService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  // Método para seleccionar una imagen utilizando la cámara o la galería
  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      this.image = {
        webviewPath: image.webPath
      };

      // Convertir la imagen seleccionada en un File
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      this.imageFile = new File([blob], 'product-image', { type: blob.type });

      // Marcar la imagen como seleccionada
      this.imageSelected = true;
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  }

  // Método para agregar un nuevo producto
  async addFood() {
    try {
      // Generar un ID único para el nuevo producto
      const newProductId = uuidv4();
      this.newFood.id = newProductId;
  
      // Si se ha seleccionado una imagen, subirla a Firebase Storage
      if (this.imageFile) {
        const filePath = `products/${newProductId}`;
  
        // Subir la imagen y obtener su URL de descarga
        this.firebaseService.uploadImageAndGetURL(this.imageFile, filePath)
          .subscribe({
            next: (downloadURL) => {
              // Asignar la URL de la imagen al nuevo producto
              this.newFood.image = downloadURL;
              
              // Agregar el nuevo producto a Firestore
              this.firebaseService.addFood(this.newFood)
                .then(() => {
                  console.log('Producto agregado exitosamente');
                  // Cerrar el modal una vez que se ha agregado el producto
                  this.modalController.dismiss();
                })
                .catch((error) => {
                  console.error('Error al agregar el producto a Firestore:', error);
                });
            },
            error: (error) => {
              console.error('Error al subir la imagen:', error);
            }
          });
      } else {
        // Si no se ha seleccionado una imagen, agregar el producto sin imagen
        await this.firebaseService.addFood(this.newFood);
        console.log('Producto agregado exitosamente');
        // Cerrar el modal una vez que se ha agregado el producto
        this.modalController.dismiss();
      }
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  }  

  // Método para cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }

  // Método ngOnDestroy para realizar limpieza cuando se destruye el componente
  ngOnDestroy() {
    // Desuscribirse de las suscripciones para evitar memory leaks
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
