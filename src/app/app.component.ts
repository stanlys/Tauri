import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { invoke } from "@tauri-apps/api/tauri";
import { BaseDirectory, downloadDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/dialog";
import readXlsxFile from "read-excel-file";
import { readBinaryFile, writeTextFile } from "@tauri-apps/api/fs";
import { ConfigServiceService } from "./services/config-service.service";
import { CONFIG_EMPTY, IConfig } from "./interfaces/config-interface";
import { IDaDataShortResponse, IDaDataToXSLX } from "./interfaces/interfaces";
import daDataRequest from "./shared/dadata";
import { sleep } from "sleep-ts";
import { COLUMNS_DADATA } from "./interfaces/schema";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
        rowStart: 1,
        rowEnd: 1,
    };

    PbProgColumns = {
        kn: 0,
        Address: 0,
    };

    selectedExcelFile = "";

    isLoadIndicatorVisible = false;

    @ViewChild("fileName") nameParagraph!: ElementRef<HTMLParagraphElement>;

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
        this.isLoadIndicatorVisible = true;
        // readXlsxFile(a).then((rows) => {
        //     // const captions = rows[0];
        //     this.tableCaptions = [];
        //     rows[0].forEach((el, index) => this.tableCaptions.push(`${index} - ${el as string}`));
        //     // this.tableCaptions = rows[0];
        // });
        // console.log("WORK");

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
            }
            // getCorrectAddressFromRow(rows, 25);
            this.saveXlsxFileDADATA("test_DADATA", dataAddress);
            console.log("All ok!!!!");
            this.isLoadIndicatorVisible = false;
        });
    }

    saveXlsxFileDADATA = async (filename: string, data: Array<IDaDataToXSLX>): Promise<void> => {
        // const workbook = new Excel.Workbook();
        // const worksheetCorrectAddress = workbook.addWorksheet("Correct Address");
        // worksheetCorrectAddress.columns = COLUMNS_DADATA;
        // const worksheetErrorAddress = workbook.addWorksheet("Error Address");
        // worksheetErrorAddress.columns = COLUMNS_DADATA;
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

        await writeTextFile({ path: "result.csv", contents: res }, { dir: BaseDirectory.Document });
        // await workbook.xlsx.writeFile(`./${filename}.xlsx`);
    };
}

// saveXlsxFileDADATA = async (filename: string, data: Array<IDaDataToXSLX>): Promise<void> => {
//     const workbook = new Excel.Workbook();
//     const worksheetCorrectAddress = workbook.addWorksheet("Correct Address");
//     worksheetCorrectAddress.columns = COLUMNS_DADATA;
//     const worksheetErrorAddress = workbook.addWorksheet("Error Address");
//     worksheetErrorAddress.columns = COLUMNS_DADATA;

//     data.forEach((answer) => {
//         if (answer.status === 200) {
//             worksheetCorrectAddress.addRow(answer);
//         } else {
//             worksheetErrorAddress.addRow(answer);
//         }
//     });

//     // Promise.all(data).then(async (answers) => {
//     //     answers.forEach((answer) => {
//     //         if (answer.status === 200) {
//     //             worksheetCorrectAddress.addRow(answer);
//     //         } else {
//     //             worksheetErrorAddress.addRow(answer);
//     //         }
//     //     });
//     await workbook.xlsx.writeFile(`${BaseDirectory.Document}/${filename}.xlsx`);
// };
// }
