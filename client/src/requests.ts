
import axios from "axios";


const routes = {
<<<<<<< HEAD
    getData: `/api/getData`,
=======
    getServerStatus: `/api`,
    getDataFromPandas: `/api/getDataFromPandas`,
    getDataFromRedis: `/api/getDataFromRedis`,
>>>>>>> 35991c4 (Adjustment with main branch)
}

enum LANG {
    GER = "german",
    ENG = "english",
    FR = "french",
    IT = "italian"
<<<<<<< HEAD
}

// Redit returns 10 results by default, use this fallback instead when no value is given
const LIMIT = 100


export const getData = async (query: string, lang: string = LANG.GER, resultLimit: number = LIMIT) => {
    const result = await axios(routes.getData, { params: { query, lang, resultLimit } });
=======
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
>>>>>>> 35991c4 (Adjustment with main branch)
    const { data } = result;
    return data
}