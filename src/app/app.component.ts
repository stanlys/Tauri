import { Component, OnInit } from "@angular/core";
import { invoke } from "@tauri-apps/api/tauri";
import { BaseDirectory, downloadDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/dialog";
import readXlsxFile from "read-excel-file";
import { readBinaryFile, writeTextFile } from "@tauri-apps/api/fs";
import { ConfigServiceService } from "./services/config-service.service";
import { CONFIG_EMPTY, IConfig } from "./interfaces/config-interface";
import { IDaDataToXSLX } from "./interfaces/interfaces";
import daDataRequest from "./shared/dadata";
import { sleep } from "sleep-ts";
import { COLUMNS_DADATA } from "./interfaces/schema";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL_DADATA, DADATA_SECRET, DADATA_TOKEN } from "./shared/axiosconfig";
import { Body, fetch } from "@tauri-apps/api/http";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
    greetingMessage = "";
    platformName = "";

    tableCaptions: string[] = [];

    globalConfig: IConfig = CONFIG_EMPTY;

    DaDataColumns = {
        kn: 0,
        Address: 0,
    };

    PbProgColumns = {
        kn: 0,
        Address: 0,
    };

    selectedExcelFile = "";

    constructor(private configServer: ConfigServiceService, private httpClient: HttpClient) {}

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
            this.selectedExcelFile = selected;
        }
    }

    greet(event: SubmitEvent, name: string): void {
        event.preventDefault();
        invoke<string>("greet", { name }).then((text) => {
            this.greetingMessage = text;
        });
        this.test();
    }

    testservice() {
        console.log(this.configServer.config);
    }

    async runDadataQueries() {
        if (this.DaDataColumns.kn === 0 || this.DaDataColumns.Address === 0) return;
        const a = await readBinaryFile(this.selectedExcelFile);
        // readXlsxFile(a).then((rows) => {
        //     // const captions = rows[0];
        //     this.tableCaptions = [];
        //     rows[0].forEach((el, index) => this.tableCaptions.push(`${index} - ${el as string}`));
        //     // this.tableCaptions = rows[0];
        // });
        // console.log("WORK");

        readXlsxFile(a).then(async (rows) => {
            const h = new HttpHeaders({
                Authorization: "Token f70add7f518a63bea96c9dce71cf4b4a685ae0e3",
                "X-Secret": "70c61bbdcbb69d18338b0115b911f3a8b02f40fb",
            });
            const dataAddress: Array<Promise<IDaDataToXSLX>> = [];
            if (rows.length >= 3) {
                for (let i = 1; i < 3; i++) {
                    console.log(`work with ${i} row `);
                    const rowAddress = rows[i][this.DaDataColumns.Address] as string;
                    if (rowAddress != null) {
                        const searchAddress = rowAddress.replace(/\(/g, "").replace(/\)/g, "");
                        console.log(searchAddress);

                        const response = await fetch("https://cleaner.dadata.ru/api/v1/clean/address", {
                            method: "POST",
                            timeout: 30,
                            body: Body.json([`${searchAddress}`]),
                            headers: {
                                Authorization: "Token f70add7f518a63bea96c9dce71cf4b4a685ae0e3",
                                "X-Secret": "70c61bbdcbb69d18338b0115b911f3a8b02f40fb",
                            },
                        });
                        console.log(response.data);
                        // this.httpClient
                        //     .post(
                        //         "https://cleaner.dadata.ru/api/v1/clean/address",
                        //         '  ["Воронежская область, г. Воронеж, ул. Воронежская, д. 16"]',
                        //         {
                        //             headers: h,
                        //         }
                        //     )
                        //     .subscribe((answer) => {
                        //         console.log(answer);
                        //     });
                        // if (response.data) dataAddress.push({ ...(response.data as IDaDataToXSLX) });
                        await sleep(100);
                    }
                }
            }
            // getCorrectAddressFromRow(rows, 25);
            this.saveXlsxFileDADATA("test_DADATA", dataAddress);

            console.log("All ok!!!!");
        });
    }

    saveXlsxFileDADATA = (filename: string, data: Array<Promise<IDaDataToXSLX>>): void => {
        // const workbook = new Excel.Workbook();
        // const worksheetCorrectAddress = workbook.addWorksheet("Correct Address");
        // worksheetCorrectAddress.columns = COLUMNS_DADATA;
        // const worksheetErrorAddress = workbook.addWorksheet("Error Address");
        // worksheetErrorAddress.columns = COLUMNS_DADATA;
        let res = "";

        Promise.all(data).then(async (answers) => {
            answers.forEach((answer) => {
                // if (answer.status === 200) {
                //     worksheetCorrectAddress.addRow(answer);
                // } else {
                //     worksheetErrorAddress.addRow(answer);
                // }
                let a = "";
                for (const [key, value] of Object.entries(answer)) {
                    a += value + ";";
                }
                res += a + "\r\n";
            });
            await writeTextFile("result.csv", res, { dir: BaseDirectory.Document });
            // await workbook.xlsx.writeFile(`./${filename}.xlsx`);
        });
    };
}
