import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    role: new FormControl('Usuario'),
  });

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  async submit() {
    if (this.form.valid && this.form.value.password === this.form.value.confirmPassword) {
      const loading = await this.loadingController.create({
        message: 'Registrando...',
        translucent: true
      });
      await loading.present();

      try {
        const res = await this.firebaseSvc.signUp(this.form.value.email, this.form.value.password);
        const uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
        await this.setUserInfo(uid);
        this.form.reset();
      } catch (error) {
        console.error(error);
        let errorMessage = 'Ha ocurrido un error';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'La dirección de correo electrónico ya está en uso por otra cuenta.';
        }
        this.utilsSvc.presentToast({
          message: errorMessage,
          duration: 2500,
          color: 'primary',
          icon: 'alert-circle-outline'
        });
      } finally {
        loading.dismiss();
      }
    } else {
      if (this.form.value.password !== this.form.value.confirmPassword) {
        this.form.controls.confirmPassword.setErrors({ noMatch: true });
      }
    }
  }

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      console.log('User Info:', this.form.value); // Verifica la información del usuario antes de guardarla
  
      const loading = await this.loadingController.create({
        message: 'Registrando...',
        translucent: true
      });
      await loading.present();
  
      try {
        // Eliminar la contraseña del formulario antes de guardarlo en la base de datos
        const userInfo = { ...this.form.value };
        delete userInfo.password;
        delete userInfo.confirmPassword;
  
        // Incluir el campo 'role' en los datos del usuario
        userInfo.role = this.form.value.role;
  
        // Guardar la información del usuario en la base de datos en la ruta correcta
        await this.firebaseSvc.setDocument(`users/${uid}`, userInfo);
  
        // Redirigir al usuario a la página principal
        this.utilsSvc.routerLink('/home/listing');
      } catch (error) {
        console.error(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          icon: 'alert-circle-outline'
        });
      } finally {
        loading.dismiss();
      }
    }
  }
  
}  
