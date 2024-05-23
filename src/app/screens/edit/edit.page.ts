import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { FoodItem } from 'src/app/models/food.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  id: string | null = null;
  food: FoodItem = {
    id: '',
    categoryId: '',
    title: '',
    price: null,
    image: '',
    description: '',
    selected: false
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private router: Router
  ) { }

  // Método ngOnInit que se ejecuta al inicializar el componente
  ngOnInit() {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id'); // Obtiene el ID de la URL
    if (idParam !== null) { // Si el ID no es nulo
      this.id = idParam; // Asigna el ID a la variable local
      this.foodService.getFood(idParam).subscribe((food: FoodItem) => {
        this.food = food; // Asigna los datos del alimento al objeto local
      });
    }
  }

  // Método para guardar los cambios del alimento
  saveChanges() {
    if (this.id) { // Si hay un ID válido
      this.foodService.updateFood(this.food).then(() => {
        this.router.navigate(['/detail', this.id]); // Navega a la página de detalles del alimento
      });
    }
  }
}