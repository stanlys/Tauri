import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
    DxButtonComponent,
    DxButtonModule,
    DxTabPanelModule,
    DxListModule,
    DxBoxModule,
    DxFormModule,
} from "devextreme-angular";
import { AppComponent } from "./app.component";
import { SettingPageComponent } from "./setting-page/setting-page.component";

@NgModule({
    declarations: [AppComponent, SettingPageComponent],
    imports: [BrowserModule, DxTabPanelModule, DxButtonModule, DxListModule, DxBoxModule, DxFormModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
