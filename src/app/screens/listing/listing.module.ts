import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ListingPage } from './listing.page';
import { ListingPageRoutingModule } from './listing-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ListingPageRoutingModule,
    SharedModule,
    FormsModule,
  ],
  declarations: [ListingPage]
})
export class ListingPageModule {}
