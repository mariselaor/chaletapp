import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() { }

  async submit() {
    if (this.form.valid) {
      try {
        this.utilsSvc.presentLoading({ message: "Autenticando..." });
        const res = await this.firebaseSvc.login(this.form.value as User);

        let user: User = {
          uid: res.user.uid,
          name: res.user.displayName || '',
          email: res.user.email || '',
          password: ''
        };        

        this.utilsSvc.setElementInLocalStorage('user', user);
        // Redirige a una página válida después de iniciar sesión
        this.utilsSvc.routerLink('/home/listing');
        this.utilsSvc.dismissLoading();

        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: 'success',
          icon: 'person-outline'
        });

        this.form.reset();
      } catch (error) {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: error.message || 'Ha ocurrido un error',
          duration: 5000,
          color: 'warning',
          icon: 'alert-circle-outline'
        });
      }
    }
  }
}
