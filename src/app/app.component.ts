import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { invoke } from "@tauri-apps/api/tauri";
import { BaseDirectory, downloadDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/dialog";
import readXlsxFile from "read-excel-file";
import { readBinaryFile, writeTextFile } from "@tauri-apps/api/fs";
import { ConfigServiceService } from "./services/config-service.service";
import { CONFIG_EMPTY, IConfig } from "./interfaces/config-interface";
import { IDaDataShortResponse, IDaDataToXSLX, IPbProgData } from "./interfaces/interfaces";
import daDataRequest from "./shared/dadata";
import { sleep } from "sleep-ts";
import { COLUMNS_DADATA } from "./interfaces/schema";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Body, fetch } from "@tauri-apps/api/http";
import { DxButtonComponent } from "devextreme-angular";
import { saveAs } from "file-saver";
import * as Excel from "exceljs";

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
        rowStart: 1,
        rowEnd: 1,
    };

    PbProgColumns = {
        kn: 0,
        Address: 0,
        rowStart: 1,
        rowEnd: 1,
    };

    selectedExcelFile = "";

    selectedExcelFilePbProg = "";

    isLoadIndicatorVisible = false;

    @ViewChild("fileName") nameParagraph!: ElementRef<HTMLParagraphElement>;
    @ViewChild("fileNamePbprog") nameParagraphPbProg!: ElementRef<HTMLParagraphElement>;
    @ViewChild(DxButtonComponent, { static: false }) runBtn!: DxButtonComponent;
    @ViewChild("test") testbutton!: ElementRef<HTMLButtonElement>;
    @ViewChild("run") button!: HTMLElement;

    constructor(private configServer: ConfigServiceService, private hostElem: ElementRef) {
        console.log(this.hostElem.nativeElement);
    }

    async test(): Promise<void> {
        this.platformName = await downloadDir();
        console.log(this.platformName);
    }

    ngOnInit() {
        this.configServer.load();
        this.globalConfig = this.configServer.config;
        console.log(this.nameParagraph);
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
            console.log(this.nameParagraph.nativeElement.textContent);
            this.selectedExcelFile = selected;
            console.log(this.selectedExcelFile);
            const selectedPath = selected.split("\\");
            this.nameParagraph.nativeElement.textContent = selectedPath[selectedPath.length - 1];
        }
    }

    async dialogPbProg(event: MouseEvent) {
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
            console.log(this.nameParagraphPbProg.nativeElement.textContent);
            this.selectedExcelFilePbProg = selected;
            console.log(this.selectedExcelFilePbProg);
            const selectedPath = selected.split("\\");
            this.nameParagraphPbProg.nativeElement.textContent = selectedPath[selectedPath.length - 1];
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

    async runPbProgQueries2() {
        const response = await fetch<Array<IPbProgData>>("https://data.pbprog.ru/api/address/full-address/parse", {
            method: "POST",
            body: Body.json({
                query: "Воронежская область, г Воронеж, ул Конституции, 99",
                count: 1,
            }),
            headers: {
                Authorization: this.globalConfig.PbProgToken,
            },
        });
        console.log(response);
    }

    async runPbProgQueries() {
        console.log("PbProg !!!!!");
        if (this.PbProgColumns.kn === 0 || this.PbProgColumns.Address === 0) return;
        this.isLoadIndicatorVisible = true;
        const a = await readBinaryFile(this.selectedExcelFilePbProg);

        readXlsxFile(a).then(async (rows) => {
            const dataAddress: Array<IDaDataToXSLX> = [];
            this.globalConfig = this.configServer.config;
            console.log(this.globalConfig);
            if (rows.length >= this.PbProgColumns.rowEnd) {
                for (let i = this.PbProgColumns.rowStart; i <= this.PbProgColumns.rowEnd; i++) {
                    console.log(`work with ${i} row `);
                    const rowAddress = rows[i][this.PbProgColumns.Address] as string;
                    const kn = rows[i][this.PbProgColumns.kn] as string | "";
                    if (rowAddress != null) {
                        const searchAddress = rowAddress.replace(/\(/g, "").replace(/\)/g, "");
                        console.log(this.globalConfig.PbProgURL);
                        const response = await fetch<Array<IPbProgData>>(
                            "https://data.pbprog.ru/api/address/full-address/parse",
                            {
                                method: "POST",
                                body: Body.json({
                                    query: "Воронежская область, г Воронеж, ул Конституции, 99",
                                    count: 1,
                                }),
                                headers: {
                                    Authorization: this.globalConfig.PbProgToken,
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        console.log(response);
                        // if (response.data) {
                        //     const answer: IDaDataToXSLX = {
                        //         kn: kn,
                        //         status: 200,
                        //         shortAddress: searchAddress,
                        //         ...response.data[0],
                        //     };
                        //     dataAddress.push(answer);
                        // }
                        await sleep(2000);
                    }
                }
                await sleep(5000);
            }
            this.saveXlsxFileDADATA2(`result.xlsx`, dataAddress);
            console.log("All ok!!!!");
        });

        this.isLoadIndicatorVisible = false;
    }

    async runDadataQueries() {
        if (this.DaDataColumns.kn === 0 || this.DaDataColumns.Address === 0) return;
        this.isLoadIndicatorVisible = true;
        const a = await readBinaryFile(this.selectedExcelFile);

        readXlsxFile(a).then(async (rows) => {
            const dataAddress: Array<IDaDataToXSLX> = [];
            this.globalConfig = this.configServer.config;
            console.log(this.globalConfig);
            if (rows.length >= this.DaDataColumns.rowEnd) {
                for (let i = this.DaDataColumns.rowStart; i <= this.DaDataColumns.rowEnd; i++) {
                    console.log(`work with ${i} row `);
                    const rowAddress = rows[i][this.DaDataColumns.Address] as string;
                    const kn = rows[i][this.DaDataColumns.kn] as string | "";
                    if (rowAddress != null) {
                        const searchAddress = rowAddress.replace(/\(/g, "").replace(/\)/g, "");
                        console.log(this.globalConfig.DaDataUrl);

                        const response = await fetch<Array<IDaDataShortResponse>>(this.globalConfig.DaDataUrl, {
                            method: "POST",
                            timeout: 30,
                            body: Body.json([`${searchAddress}`]),
                            headers: {
                                Authorization: `Token ${this.globalConfig.DaDataToken}`,
                                "X-Secret": this.globalConfig.DaDataSecret,
                            },
                        });
                        console.log(response.data[0]);
                        if (response.data) {
                            const answer: IDaDataToXSLX = {
                                kn: kn,
                                status: 200,
                                shortAddress: searchAddress,
                                ...response.data[0],
                            };
                            dataAddress.push(answer);
                        }
                        await sleep(100);
                    }
                }
                await sleep(5000);
            }
            this.saveXlsxFileDADATA2(`result.xlsx`, dataAddress);
            console.log("All ok!!!!");
            this.isLoadIndicatorVisible = false;
        });
    }

    saveXlsxFileDADATA = async (filename: string, data: Array<IDaDataToXSLX>): Promise<void> => {
        let res = "";

        // console.log(data);
        res += "Адрес в запросе" + ";";
        res += "КН в запросе " + ";";
        res += "Индекс " + ";";
        res += "Адрес ФИАС " + ";";
        res += "КН квартиры " + ";";
        res += "КН ОКС " + ";";
        res += "КН ЗУ" + ";";
        res += "Долгота " + ";";
        res += "Широта " + ";";
        res += "Статус ответа " + ";";

        data.forEach((row) => {
            let a = "";

            a += row.shortAddress + ";";
            a += row.kn + ";";
            a += row.postal_code + ";";
            a += row.result + ";";
            a += row.flat_cadnum + ";";
            a += row.house_cadnum + ";";
            a += row.stead_cadnum + ";";
            a += row.geo_lat + ";";
            a += row.geo_lon + ";";
            a += row.qc + ";";

            res += a + "\r\n";
        });

        // Promise.all(data).then(async (answers) => {
        //     answers.forEach((answer) => {
        //         // if (answer.status === 200) {
        //         //     worksheetCorrectAddress.addRow(answer);
        //         // } else {
        //         //     worksheetErrorAddress.addRow(answer);
        //         // }
        //         let a = "";
        //         for (const [key, value] of Object.entries(answer)) {
        //             a += value + ";";
        //         }
        //         res += a + "\r\n";
        //     });

        // await writeTextFile({ path: "result.csv", contents: res }, { dir: BaseDirectory.Document });
        // await workbook.xlsx.writeFile(`./${filename}.xlsx`);
    };

    testViewChield() {
        console.log(this.runBtn);
        console.log(this.testbutton.nativeElement.textContent);
        // this.saveXlsxFileDADATA2("1111", []);
        const workbook = new Excel.Workbook();
        const worksheetCorrectAddress = workbook.addWorksheet("Correct Address");
        worksheetCorrectAddress.columns = COLUMNS_DADATA;
        const worksheetErrorAddress = workbook.addWorksheet("Error Address");
        worksheetErrorAddress.columns = COLUMNS_DADATA;
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            // saveAs(blob, `${BaseDirectory.Document}/${filename}.xlsx`);
        });
    }

    saveXlsxFileDADATA2 = async (filename: string, data: Array<IDaDataToXSLX>): Promise<void> => {
        const workbook = new Excel.Workbook();
        const worksheetCorrectAddress = workbook.addWorksheet("Correct Address");
        worksheetCorrectAddress.columns = COLUMNS_DADATA;
        const worksheetErrorAddress = workbook.addWorksheet("Error Address");
        worksheetErrorAddress.columns = COLUMNS_DADATA;
        worksheetCorrectAddress.addRows(data);
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, filename);
        });
        // await workbook.xlsx.writeFile(`${BaseDirectory.Document}/${filename}.xlsx`);
    };
}

// }
