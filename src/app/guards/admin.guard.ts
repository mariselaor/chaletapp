import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.firebaseService.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (user && user.role === 'Administrador') {
          return true; // Permitir el acceso si el usuario está autenticado y tiene el rol de administrador
        } else {
          return this.router.createUrlTree(['/']); // Redirigir al inicio si el usuario no es administrador
        }
      })
    );
  }
}
