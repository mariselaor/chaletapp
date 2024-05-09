import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  handleSearch(event: CustomEvent) {
    const searchTerm = event.detail.value;
    
  }

}