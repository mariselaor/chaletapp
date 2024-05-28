import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AdminGuard } from '../guards/admin.guard';

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
        path: 'pedido',
        loadChildren: () => import('../screens/pedido/pedido.module').then( m => m.PedidoPageModule),
        canActivate: [AdminGuard] 
      },       
      {
        path: '', // Redirecciona al listado por defecto si no hay ninguna ruta especificada
        redirectTo: 'listing',
        pathMatch: 'full',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
