import { Injectable } from "@angular/core";
import { CONFIG_EMPTY, IConfig } from "../interfaces/config-interface";
import { writeTextFile, BaseDirectory, readTextFile, exists } from "@tauri-apps/api/fs";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ConfigServiceService {
    config: IConfig = CONFIG_EMPTY;
    configObserver = new BehaviorSubject<IConfig>(CONFIG_EMPTY);

    constructor() {}

    async save(newConfig: IConfig) {
        this.config = newConfig;
        await writeTextFile("app.conf", JSON.stringify(this.config), { dir: BaseDirectory.Document });
        console.log("new value -", newConfig);
        this.configObserver.next(newConfig);
    }

    load() {
        this.loadConfigFromFile().then((config) => {
            this.config = config;
            this.configObserver.next(config);
        });
        console.log("Loading: ", this.config);
        // console.log(this.config);
        // return isLocalFileConfig ? this.config : CONFIG_EMPTY;
    }

    async loadConfigFromFile(): Promise<IConfig> {
        let _config = CONFIG_EMPTY;
        const isLocalFileConfig = await exists("app.conf", { dir: BaseDirectory.Document });
        console.log(isLocalFileConfig);
        if (isLocalFileConfig) {
            _config = JSON.parse(await readTextFile("app.conf", { dir: BaseDirectory.Document }));
        }
        return _config;
    }

    clearLocal(): void {
        console.log("clear");
        this.config = CONFIG_EMPTY;
    }
}
