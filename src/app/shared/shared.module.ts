import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BadgeComponent } from './components/badge/badge.component';
import { ButtonComponent } from './components/button/button.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { FoodCardComponent } from './components/food-card/food-card.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { LogoComponent } from './components/logo/logo.component';
import { HeaderComponent } from './components/header/header.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';

@NgModule({
  declarations: [
    BadgeComponent,
    ButtonComponent,
    CartItemComponent,
    CustomInputComponent,
    FoodCardComponent,
    SearchbarComponent,
    LogoComponent,
    HeaderComponent,
    AddProductComponent,
    CustomSelectComponent
  ],
  exports: [
    BadgeComponent,
    ButtonComponent,
    CartItemComponent,
    CustomInputComponent,
    FoodCardComponent,
    SearchbarComponent,
    LogoComponent,
    HeaderComponent,
    AddProductComponent,
    CustomSelectComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class SharedModule { }
