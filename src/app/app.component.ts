import { Component, OnInit } from "@angular/core";
import { invoke } from "@tauri-apps/api/tauri";
import { platform } from "@tauri-apps/api/os";
import { getName } from "@tauri-apps/api/app";
import { downloadDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/dialog";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
    greetingMessage = "";
    platformName = "";

    async test(): Promise<void> {
        this.platformName = await downloadDir();
        console.log(this.platformName);
    }

    ngOnInit() {
        this.test();
    }

    async dialog(event: MouseEvent) {
        const selected = await open({
            multiple: false,
            filters: [
                {
                    name: "Excel",
                    extensions: ["xlsx", "xls"],
                },
            ],
        });
        if (Array.isArray(selected)) {
            // user selected multiple files
            console.log(selected);
        } else if (selected === null) {
            // user cancelled the selection
        } else {
            // user selected a single file
            console.log(selected);
        }
    }

    greet(event: SubmitEvent, name: string): void {
        event.preventDefault();

        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        invoke<string>("greet", { name }).then((text) => {
            this.greetingMessage = text;
        });
        this.test();
    }
}
