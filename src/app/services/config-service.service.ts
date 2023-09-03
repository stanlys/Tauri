import { Injectable } from "@angular/core";
import { CONFIG_EMPTY, IConfig } from "../interfaces/config-interface";
import { writeTextFile, BaseDirectory, readTextFile, exists } from "@tauri-apps/api/fs";

@Injectable({
    providedIn: "root",
})
export class ConfigServiceService {
    config: IConfig = CONFIG_EMPTY;

    constructor() {}

    async save(newConfig: IConfig) {
        this.config = newConfig;
        await writeTextFile("app.conf", JSON.stringify(this.config), { dir: BaseDirectory.Document });
    }

    async load(): Promise<IConfig> {
        const isLocalFileConfig = await exists("app.conf", { dir: BaseDirectory.Document });
        console.log(isLocalFileConfig);
        if (isLocalFileConfig) {
            this.config = JSON.parse(await readTextFile("app.conf", { dir: BaseDirectory.Document }));
        }
        console.log(this.config);
        return isLocalFileConfig ? this.config : CONFIG_EMPTY;
    }

    clearLocal(): void {
        console.log("clear");
        this.config = CONFIG_EMPTY;
    }
}
