import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'listing',
        loadChildren: () => import('../screens/listing/listing.module').then(m => m.ListingPageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../screens/cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'listing',
        loadChildren: () => import('../screens/listing/listing.module').then(m => m.ListingPageModule),
        canActivate: [AuthGuard] // Asegúrate de que la guardia esté configurada correctamente si es necesaria
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
