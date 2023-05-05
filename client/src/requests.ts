
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

export const getData = async (query: string, service: string = "",  owner: string = "", lang: string = LANG.GER, resultLimit: number = LIMIT) => {
    const result = await axios(routes.getData, { params: { query, service, owner, lang, resultLimit } });
    const { data } = result;
    return data
}