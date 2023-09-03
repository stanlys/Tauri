import { Component, OnInit } from "@angular/core";
import { writeTextFile, BaseDirectory, readTextFile, exists } from "@tauri-apps/api/fs";
import { ConfigServiceService } from "../services/config-service.service";
import { CONFIG_EMPTY } from "../interfaces/config-interface";

@Component({
    selector: "app-setting-page",
    templateUrl: "./setting-page.component.html",
    styleUrls: ["./setting-page.component.css"],
})
export class SettingPageComponent implements OnInit {
    config = {
        PbProgToken: "",
        PbProgSecret: "",
        PbProgURL: "",
        DaDataToken: "",
        DaDataSecret: "",
        DaDataUrl: "",
    };

    constructor(private configService: ConfigServiceService) {
    }

    ngOnInit(): void {
        // console.log("read default config");
        console.log("444", this.configService.config);
        this.config = this.configService.config;
        // this.configService.load().then((config) => (this.config = config));
    }

    async save() {
        this.configService.save(this.config);
    }

    clear(): void {
        this.configService.clearLocal();
        this.config = CONFIG_EMPTY;
    }
}
