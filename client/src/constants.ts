export const DEFAULTSERVICE = "Alle Services";
export const DEFAULTPROVIDER = "Alle Quellen";
export const DEFAULTOFFSET = 0;
export const DEFAULTLIMIT = 10000;
export const DEFAULTPAGE = 0;

export enum LANG {
    GER = "german",
    ENG = "english",
    FR = "french",
    IT = "italian"
}
export const DEFAULTLANGUAGE = LANG.GER;

export enum SERVICETYPE {
    WFS = "wfs",
    WMS = "wms",
    WMTS = "wmts",
    NONE = ""
}


export const PROVIDERLIST = [
    DEFAULTPROVIDER,
    "Bund",
    "Geodienste",
    "KT_AG",
    "KT_AI",
    "KT_AR",
    "KT_BE",
    "KT_BL",
    "KT_BS",
    "KT_FR",
    "KT_GE",
    "KT_GL",
    "KT_GR",
    "KT_JU",
    "KT_SG",
    "KT_SH",
    "KT_SO",
    "KT_SZ",
    "KT_TG",
    "KT_TI",
    "KT_VD",
    "KT_UR",
    "KT_ZG",
    "KT_ZH",
    "FL_LI",
];
export const SERVICELIST = [DEFAULTSERVICE, "wfs", "wms", "wmts"];
