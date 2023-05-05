
import axios from "axios";


const routes = {
    getData: `/api/getData`,
}

enum LANG {
    GER = "german",
    ENG = "english",
    FR = "french",
    IT = "italian"
}

// Redit returns 10 results by default, use this fallback instead when no value is given
const LIMIT = 100

enum SERVICETYPE {
    WFS = "WFS",
    WMS = "WMS",
    WMTS = "WMTS",
    NONE = ""
}

export const getData = async (query: string, service: string = SERVICETYPE.NONE,  owner: string = "", lang: string = LANG.GER, resultLimit: number = LIMIT) => {
    const result = await axios(routes.getData, { params: { query, service, owner, lang, resultLimit } });
    const { data } = result;
    return data
}