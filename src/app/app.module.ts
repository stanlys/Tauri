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
import { HttpClientModule } from "@angular/common/http";
import { DxLoadIndicatorModule } from "devextreme-angular";

@NgModule({
    declarations: [AppComponent, SettingPageComponent],
    imports: [
        BrowserModule,
        DxTabPanelModule,
        DxButtonModule,
        DxListModule,
        DxBoxModule,
        DxFormModule,
        HttpClientModule,
        DxLoadIndicatorModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
