const COLUMNS = [
    { key: "kn", header: "Address" },
    { key: "shortAddress", header: "Короткий адрес" },
    { key: "FIASAddress", header: "ФИАС Адрес" },
];

const COLUMNS_DADATA = [
    { key: "kn", header: "Address" },
    { key: "shortAddress", header: "Короткий адрес" },
    { key: "result", header: "ФИАС Адрес" },
    { key: "geo_lat", header: "Координаты: широта" },
    { key: "geo_lon", header: "Координаты: долгота" },
    { key: "postal_code", header: "Индекс" },
    { key: "flat_cadnum", header: "Кадастровый номер квартиры" },
    { key: "house_cadnum", header: "	Кадастровый номер дома" },
    { key: "stead_cadnum", header: "	Кадастровый номер земельного участка" },
    { key: "qc", header: "Код проверки адреса" },
];

export { COLUMNS, COLUMNS_DADATA };
