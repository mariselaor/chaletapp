import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isAdmin: boolean = false;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    // Obtener el usuario actual y verificar si es administrador
    this.firebaseService.getCurrentUser().subscribe(user => {
      if (user && user.role === 'Administrador') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });
  }
}
