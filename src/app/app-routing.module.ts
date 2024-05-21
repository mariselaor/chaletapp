import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('./screens/detail/detail.module').then(m => m.DetailPageModule)
  },  
  {
    path: 'profile',
    loadChildren: () => import('./home/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'listing',
    loadChildren: () => import('./screens/listing/listing.module').then(m => m.ListingPageModule)
  },  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }