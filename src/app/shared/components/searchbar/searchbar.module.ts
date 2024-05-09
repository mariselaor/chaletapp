import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { SearchbarComponent } from "./searchbar.component";
import { NgModule } from "@angular/core";

@NgModule({
    declarations: [SearchbarComponent],
    imports: [ CommonModule, IonicModule ],
    exports: [SearchbarComponent],
})
export class SearchbarModule {}