export interface DetailData {
    postal_code?: string;
    region_fias_id?: string;
    region_kladr_id?: string;
    region_with_type?: string;
    region_type?: string;
    region_type_full?: string;
    region?: string;
    area_fias_id?: string;
    area_kladr_id?: string;
    area_with_type?: string;
    area_type?: string;
    area_type_full?: string;
    area?: string;
    city_fias_id?: string;
    city_kladr_id?: string;
    city_with_type?: string;
    city_type?: string;
    city_type_full?: string;
    city?: string;
    city_district_fias_id?: string;
    city_district_kladr_id?: string;
    city_district_with_type?: string;
    city_district_type?: string;
    city_district_type_full?: string;
    city_district?: string;
    settlement_fias_id?: string;
    settlement_kladr_id?: string;
    settlement_with_type?: string;
    settlement_type?: string;
    settlement_type_full?: string;
    settlement?: string;
    street_fias_id?: string;
    street_kladr_id?: string;
    street_with_type?: string;
    street_type?: string;
    street_type_full?: string;
    street?: string;
    house_fias_id?: string;
    house_kladr_id?: string;
    house_type?: string;
    house_type_full?: string;
    house?: string;
    block_type?: string;
    block_type_full?: string;
    block?: string;
    flat_type?: string;
    flat_type_full?: string;
    flat?: string;
    fias_id?: string;
    fias_level?: string;
    fias_actuality_state?: string;
    kladr_id?: string;
    okato?: string;
    oktmo?: string;
}

export interface Response {
    value: string;
    unrestricted_value: string;
    data: DetailData;
}

export interface Suggestion {
    suggestions: Array<Response>;
}

export interface IData {
    kn: string;
    shortAddress: string;
    FIASAddress: string;
    status: number;
}

export interface IServerAnswer {
    status: number;
    answer: string;
}

export interface IDadataResponse {
    source: string;
    result: string;
    postal_code: string;
    country: string;
    country_iso_code?: string;
    federal_district?: string;
    region_fias_id?: string;
    region_kladr_id?: string;
    region_iso_code?: string;
    region_with_type?: string;
    region_type?: string;
    region_type_full?: string;
    region?: string;
    area_fias_id?: string;
    area_kladr_id?: string;
    area_with_type?: string;
    area_type?: string;
    area_type_full?: string;
    area?: string;
    city_fias_id?: string;
    city_kladr_id?: string;
    city_with_type?: string;
    city_type?: string;
    city_type_full?: string;
    city?: string;
    city_area?: string;
    city_district_fias_id?: string;
    city_district_kladr_id?: string;
    city_district_with_type?: string;
    city_district_type?: string;
    city_district_type_full?: string;
    city_district?: string;
    settlement_fias_id?: string;
    settlement_kladr_id?: string;
    settlement_with_type?: string;
    settlement_type?: string;
    settlement_type_full?: string;
    settlement?: string;
    street_fias_id?: string;
    street_kladr_id?: string;
    street_with_type?: string;
    street_type?: string;
    street_type_full?: string;
    street?: string;
    stead_fias_id?: string;
    stead_kladr_id?: string;
    stead_cadnum?: string;
    stead_type?: string;
    stead_type_full?: string;
    stead?: string;
    house_fias_id?: string;
    house_kladr_id?: string;
    house_cadnum?: string;
    house_type?: string;
    house_type_full?: string;
    house?: string;
    block_type?: string;
    block_type_full?: string;
    block?: string;
    entrance?: string;
    floor?: string;
    flat_fias_id?: string;
    flat_cadnum?: string;
    flat_type?: string;
    flat_type_full?: string;
    flat?: string;
    flat_area?: string;
    square_meter_price?: string;
    flat_price?: string;
    postal_box?: string;
    fias_id?: string;
    fias_code?: string;
    fias_level?: string;
    fias_actuality_state?: string;
    kladr_id?: string;
    capital_marker?: string;
    okato?: string;
    oktmo?: string;
    tax_office?: string;
    tax_office_legal?: string;
    timezone?: string;
    geo_lat?: string;
    geo_lon?: string;
    beltway_hit?: string;
    beltway_distance?: string;
    qc_geo?: number;
    qc_complete?: number;
    qc_house?: number;
    qc?: number;
    unparsed_parts?: string;
    metro?: any;
}

export type IDaDataShortResponse = Pick<
    IDadataResponse,
    "result" | "geo_lat" | "geo_lon" | "qc" | "postal_code" | "stead_cadnum" | "flat_cadnum" | "house_cadnum"
>;

export interface IDaDataServerAnswer {
    status: number;
    answer: IDaDataShortResponse;
}

export const DEFAULT_DADATA_SHORT: IDaDataShortResponse = {
    postal_code: "",
    result: "",
    flat_cadnum: "",
};

export interface IDaDataToXSLX {
    kn: string;
    shortAddress: string;
    result: string;
    geo_lat?: string;
    geo_lon?: string;
    qc?: number;
    postal_code: string;
    flat_cadnum?: string;
    house_cadnum?: string;
    status: number;
    stead_cadnum?: string;
}

export interface IPbProgData {
    postal_code?: string;
    region_fias_id?: string;
    region_kladr_id?: string;
    region_with_type?: string;
    region_type?: string;
    region_type_full?: string;
    region?: string;
    area_fias_id?: string;
    area_kladr_id?: string;
    area_with_type?: string;
    area_type?: string;
    area_type_full?: string;
    area?: string;
    city_fias_id?: string;
    city_kladr_id?: string;
    city_with_type?: string;
    city_type?: string;
    city_type_full?: string;
    city?: string;
    city_district_fias_id?: string;
    city_district_kladr_id?: string;
    city_district_with_type?: string;
    city_district_type?: string;
    city_district_type_full?: string;
    city_district?: string;
    settlement_fias_id?: string;
    settlement_kladr_id?: string;
    settlement_with_type?: string;
    settlement_type?: string;
    settlement_type_full?: string;
    settlement?: string;
    street_fias_id?: string;
    street_kladr_id?: string;
    street_with_type?: string;
    street_type?: string;
    street_type_full?: string;
    street?: string;
    house_fias_id?: string;
    house_kladr_id?: string;
    house_type?: string;
    house_type_full?: string;
    house?: string;
    block_type?: string;
    block_type_full?: string;
    block?: string;
    flat_type?: string;
    flat_type_full?: string;
    flat?: string;
    fias_id?: string;
    fias_level?: string;
    fias_actuality_state?: string;
    kladr_id?: string;
    okato?: string;
    oktmo?: string;
}

export interface Suggestion {
    suggestions: Array<Response>;
}