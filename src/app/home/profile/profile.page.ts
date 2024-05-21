import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user = {} as User

  constructor(
    private firebasSvc: FirebaseService,
    private utilSvc: UtilsService,
    private alertController: AlertController,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.firebasSvc.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        // El usuario no está autenticado, redirige a la página de inicio de sesión
        this.router.navigateByUrl('/auth');
      }
    });
  }


  signOut() {
    this.utilSvc.presentAlert({
      header: 'Cerrar Sesión',
      message: '¿Quieres cerrar sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, cerrar',
          handler: () => {
            this.firebasSvc.signOut();
          }
        }
      ]
    });
  }
}
