
import axios from "axios";


const routes = {
    getData: `/api/getData`,
    getArcgisproWFS: "/templates/arcgispro_wfs_template.lyrx",
    getArcgisproWMS: "/templates/arcgispro_wms_template.lyrx",
    getArcgisproWMTS: "/templates/arcgispro_wmts_template.lyrx",
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
    WFS = "wfs",
    WMS = "wms",
    WMTS = "wmts",
    NONE = ""
}

export const getData = async (query: string, service: string = SERVICETYPE.NONE,  owner: string = "", lang: string = LANG.GER, resultLimit: number = LIMIT) => {
    const result = await axios(routes.getData, { params: { query, service, owner, lang, resultLimit } });
    const { data } = result;
    return data
}

const linkBuilder = (blob: any, fileName: string, fileExtension: string) => {
    const url = window.URL.createObjectURL(
        new Blob([blob]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
        'download',
        `${fileName}.${fileExtension}`,
    );

    // Build link, download, cleanup:
    document.body.appendChild(link);
    link.click();
    link && link.parentNode && link.parentNode.removeChild(link);
}

export const getArcgisproWFS = async (fileName: string) => {
    await fetch(routes.getArcgisproWFS)
        .then((response) => response.blob())
        .then((blob) => linkBuilder(blob, fileName, "lyrx")
        )
}
export const getArcgisproWMS = async (fileName: string) => {
    await fetch(routes.getArcgisproWMS)
        .then((response) => response.blob())
        .then((blob) => linkBuilder(blob, fileName, "lyrx")
        )
}
export const getArcgisproWMTS = async (fileName: string) => {
    await fetch(routes.getArcgisproWMTS)
        .then((response) => response.blob())
        .then((blob) => linkBuilder(blob, fileName, "lyrx")
        )
}