
import axios from "axios";


const routes = {
    getServerStatus: `/api`,
    getDataFromPandas: `/api/getDataFromPandas`,
    getDataFromRedis: `/api/getDataFromRedis`,
}

enum LANG {
    GER = "german",
    ENG = "english",
    FR = "french",
    IT = "italian"
}

// Redit returns 10 results by default, use this fallback instead when no value is given
const LIMIT = 100

export const getServerStatus = async () => {
    const result = await axios(routes.getServerStatus, {});
    const { message } = result.data;
    return message
}
export const getData = async (query: string, lang: string = LANG.GER, resultLimit: number = LIMIT) => {
    const result = await axios(routes.getDataFromRedis, { params: { query, lang, resultLimit } });
    const { data } = result;
    return data
}