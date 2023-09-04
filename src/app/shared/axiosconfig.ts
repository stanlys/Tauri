import axios from "axios";
// import * as https from "https";

const BASE_URL_PBPROG = "https://data.pbprog.ru/api/address/full-address/parse";

const Authorization = "b2a9ab54221142a895e48487a10a52c10676e226";

// const agent = new https.Agent({
//     rejectUnauthorized: false,
// });

const axiosInstancePbProg = axios.create({
    baseURL: BASE_URL_PBPROG,
    timeout: 1000,
    headers: {
        Authorization: Authorization,
        "Content-Type": "application/json",
    },
    // httpsAgent: agent,
});

export const DADATA_TOKEN = "f70add7f518a63bea96c9dce71cf4b4a685ae0e3";

export const DADATA_SECRET = "70c61bbdcbb69d18338b0115b911f3a8b02f40fb";

export const BASE_URL_DADATA = "https://cleaner.dadata.ru/api/v1/clean/address";

const axiosInstanceDadata = axios.create({
    baseURL: BASE_URL_DADATA,
    timeout: 1000,
    headers: {
        Authorization: "Token " + DADATA_TOKEN,
        "X-Secret": DADATA_SECRET,
        "Content-Type": "application/json",
    },
});

export { axiosInstancePbProg, axiosInstanceDadata };
