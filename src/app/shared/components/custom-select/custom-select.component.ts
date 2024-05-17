import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() icon!: string;
  @Input() selectOptions: string[] = []; 

  customSelectOptions: any = { header: 'Selecciona una opción' }; // Puedes personalizar las opciones del ion-select aquí


  constructor() { }

  ngOnInit() {
  }

}
