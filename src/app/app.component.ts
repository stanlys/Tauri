import { Component, OnInit } from "@angular/core";
import { invoke } from "@tauri-apps/api/tauri";
import { downloadDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/dialog";
import readXlsxFile from "read-excel-file";
import { readBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";
import { ConfigServiceService } from "./services/config-service.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
    greetingMessage = "";
    platformName = "";

    tableCaptions: string[] = [];

    globalConfig = {};

    constructor(private configServer: ConfigServiceService) {}

    async test(): Promise<void> {
        this.platformName = await downloadDir();
        console.log(this.platformName);
    }

    ngOnInit() {
        this.configServer.load();
        this.globalConfig = this.configServer.config;
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
            const a = await readBinaryFile(selected);
            readXlsxFile(a).then((rows) => {
                // const captions = rows[0];
                this.tableCaptions = [];
                rows[0].forEach((el, index) => this.tableCaptions.push(`${index} - ${el as string}`));
                // this.tableCaptions = rows[0];
                console.log(this.tableCaptions);
            });
            // fetch(selected)
            //     .then((response) => response.blob())
            //     .then((blob) => readXlsxFile(blob))
            //     .then((rows) => {
            //         console.log(rows);
            //         // `rows` is an array of rows
            //         // each row being an array of cells.
            //     });
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

    testservice() {
        console.log(this.configServer.config);
    }
}
