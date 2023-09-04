import { axiosInstanceDadata } from "./axiosconfig";
import {
    IDaDataShortResponse,
    IDaDataServerAnswer,
    IDadataResponse,
    IData,
    IDaDataToXSLX,
    DEFAULT_DADATA_SHORT,
} from "../interfaces/interfaces";

const sendToDaData = async (query: string): Promise<IDaDataServerAnswer> => {
    const response = await axiosInstanceDadata
        .post<Array<IDadataResponse>>("", JSON.stringify([query]))
        .then((value) => {
            if (value.data) {
                const a: IDaDataShortResponse = { ...value.data[0] };
                return a;
                //return value.data.suggestions.length > 0 ? value.data.suggestions[0].unrestricted_value : "";
            } else {
                return undefined;
            }
        })
        .catch((error) => {
            console.log(`error on ${query}`);
            return "";
        });
    if (response !== "") {
        return { status: 200, answer: { ...(response as IDaDataShortResponse) } };
    } else return { status: 404, answer: DEFAULT_DADATA_SHORT };
};

const daDataRequest = async (kn: string, searchAddress: string): Promise<IDaDataToXSLX> => {
    const correctedAddress = await sendToDaData(searchAddress);
    const res: IDaDataToXSLX = {
        kn,
        shortAddress: searchAddress,
        status: correctedAddress.status,
        ...correctedAddress.answer,
    };
    return new Promise((resolve) => resolve(res));
};

export default daDataRequest;
