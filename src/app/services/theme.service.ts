import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  darkMode = new BehaviorSubject(false);

  constructor() { }

  setInitialTheme() {
    let darkMode = JSON.parse(localStorage.getItem('dark-mode'));
    if (darkMode) {
      this.setTheme(darkMode)
    } else {      
      this.setTheme(darkMode)

    }
  }

  setTheme(darkMode: boolean) {
    if (darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');

    }
    this.darkMode.next(darkMode);
    localStorage.setItem('dark-mode', JSON.stringify(darkMode));
  }
}
