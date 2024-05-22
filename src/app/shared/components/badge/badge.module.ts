import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BadgeComponent } from "./badge.component";
import { IonicModule } from "@ionic/angular";


@NgModule({
    declarations: [ BadgeComponent],
    imports: [CommonModule, IonicModule],
    exports: [ BadgeComponent ],
})
export class BadgeModule { }