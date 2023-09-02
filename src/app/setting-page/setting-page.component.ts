import { Component, OnInit } from "@angular/core";
import { writeTextFile, BaseDirectory, readTextFile, exists } from "@tauri-apps/api/fs";

@Component({
    selector: "app-setting-page",
    templateUrl: "./setting-page.component.html",
    styleUrls: ["./setting-page.component.css"],
})
export class SettingPageComponent implements OnInit {
    employee = {
        name: "",
        position: "",
        hireDate: new Date(),
        officeNumber: 0,
        phone: "",
        skype: "",
        email: "",
        notes: "",
    };

    async ngOnInit(): Promise<void> {
        console.log("read default config");
        const isLocalFileConfig = await exists("app.conf", { dir: BaseDirectory.Document });
        if (isLocalFileConfig)
            this.employee = JSON.parse(await readTextFile("app.conf", { dir: BaseDirectory.Document }));
    }

    async save() {
        console.log(BaseDirectory.Document);
        await writeTextFile("app.conf", JSON.stringify(this.employee), { dir: BaseDirectory.Document });
    }
}