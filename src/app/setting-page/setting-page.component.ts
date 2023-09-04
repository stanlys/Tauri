import { Component, OnInit, OnDestroy } from "@angular/core";
import { writeTextFile, BaseDirectory, readTextFile, exists } from "@tauri-apps/api/fs";
import { ConfigServiceService } from "../services/config-service.service";
import { CONFIG_EMPTY, IConfig } from "../interfaces/config-interface";
import { Observable } from "rxjs";

@Component({
    selector: "app-setting-page",
    templateUrl: "./setting-page.component.html",
    styleUrls: ["./setting-page.component.css"],
})
export class SettingPageComponent implements OnDestroy {
    config: IConfig = {
        PbProgToken: "",
        PbProgSecret: "",
        PbProgURL: "",
        DaDataToken: "",
        DaDataSecret: "",
        DaDataUrl: "",
    };

    constructor(private configService: ConfigServiceService) {
        this.configService.configObserver.subscribe((v) => (this.config = v));
    }
    ngOnDestroy(): void {
        this.configService.configObserver.unsubscribe;
    }

    ngOnInit(): void {}

    async save() {
        console.log(this.config);
        this.configService.save(this.config);
    }

    clear(): void {
        this.configService.clearLocal();
        this.config = CONFIG_EMPTY;
    }
}
