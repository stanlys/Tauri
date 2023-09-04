import { Injectable } from "@angular/core";
import { CONFIG_EMPTY, IConfig } from "../interfaces/config-interface";
import { writeTextFile, BaseDirectory, readTextFile, exists } from "@tauri-apps/api/fs";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ConfigServiceService {
    config: IConfig = CONFIG_EMPTY;
    configObserver = new Subject<IConfig>();

    constructor() {}

    async save(newConfig: IConfig) {
        await writeTextFile("app.conf", JSON.stringify(this.config), { dir: BaseDirectory.Document });
        this.setConfig(newConfig);
    }

    load() {
        this.loadConfigFromFile().then((config) => {
            this.setConfig(config);
        });
    }

    async loadConfigFromFile(): Promise<IConfig> {
        let _config = CONFIG_EMPTY;
        const isLocalFileConfig = await exists("app.conf", { dir: BaseDirectory.Document });
        if (isLocalFileConfig) {
            _config = JSON.parse(await readTextFile("app.conf", { dir: BaseDirectory.Document }));
        }
        return _config;
    }

    clearLocal(): void {
        console.log("clear");
        this.setConfig(CONFIG_EMPTY);
    }

    setConfig(newValue: IConfig) {
        this.config = newValue;
        this.configObserver.next(newValue);
    }
}
