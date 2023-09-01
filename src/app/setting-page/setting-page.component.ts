import { Component } from "@angular/core";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

@Component({
    selector: "app-setting-page",
    templateUrl: "./setting-page.component.html",
    styleUrls: ["./setting-page.component.css"],
})
export class SettingPageComponent {
    employee = {
        name: "John Heart",
        position: "CEO",
        hireDate: new Date(2012, 4, 13),
        officeNumber: 901,
        phone: "+1(213) 555-9392",
        skype: "jheart_DX_skype",
        email: "jheart@dx-email.com",
        notes: "John has been in the Audio/Video industry since 1990.",
    };

    async save() {
        console.log(BaseDirectory.Document);
        await writeTextFile("app.conf", JSON.stringify(this.employee), { dir: BaseDirectory.Document });
    }
}
