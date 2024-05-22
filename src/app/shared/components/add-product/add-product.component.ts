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
    image: ''
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

      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      this.imageFile = new File([blob], 'product-image', { type: blob.type });

      // Marcar la imagen como seleccionada
      this.imageSelected = true;
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  }

  async addFood() {
    try {
      const newProductId = uuidv4();
      this.newFood.id = newProductId;
  
      if (this.imageFile) {
        const filePath = `products/${newProductId}`;
  
        this.firebaseService.uploadImageAndGetURL(this.imageFile, filePath)
          .subscribe({
            next: (downloadURL) => {
              this.newFood.image = downloadURL;
              this.firebaseService.addFood(this.newFood)
                .then(() => {
                  console.log('Producto agregado exitosamente');
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
        await this.firebaseService.addFood(this.newFood);
        console.log('Producto agregado exitosamente');
        this.modalController.dismiss();
      }
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  }  

  closeModal() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
