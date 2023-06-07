
import axios from "axios";
import { Geoservice } from "./types";
import { parseQgisTemplate } from "./templateParser/qgisParser";
import { parseArcgisWFS, parseArcgisWMSorWMTS } from "./templateParser/arcgisParser";
import { LANG, SERVICETYPE, DEFAULTLIMIT, DEFAULTOFFSET } from "./constants";


const routes = {
    getData: `/api/getData`,
    getArcgisproWFS: "/templates/arcgispro_wfs_template.lyrx",
    getArcgisproWMS: "/templates/arcgispro_wms_template.lyrx",
    getArcgisproWMTS: "/templates/arcgispro_wmts_template.lyrx",
    getQgisWFS: "/templates/qgis_wfs_template.qlr",
    getQgisWMS: "/templates/qgis_wms_template.qlr",
    getQgisWMTS: "/templates/qgis_wmts_template.qlr",
}

export const getData = async (query_string: string, service: string = SERVICETYPE.NONE, owner: string = "", lang: string = LANG.GER, offset: number = DEFAULTOFFSET, limit: number = DEFAULTLIMIT, pageIndex: number, size: number) => {
    const page = pageIndex + 1 // FastAPI Pagination uses 1 as first index
    console.log("request", { query_string, service, owner, lang, offset, limit, page, size })
    const response = await axios(routes.getData, { params: { query_string, service, owner, lang, offset, limit, page, size } });
    const result = { ...response, data: { ...response.data, page: page - 1 } } // Translate back to zero indexed MUI value
    return result
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

export const getArcgisproWFS = async (data: Geoservice) => {
    await fetch(routes.getArcgisproWFS)
        .then((response) => parseArcgisWFS(data, response))
        .then((blob) => linkBuilder(blob, data.TITLE || "filename", "lyrx")
        )
}
export const getArcgisproWMS = async (data: Geoservice) => {
    await fetch(routes.getArcgisproWMS)
        .then((response) => parseArcgisWMSorWMTS(data, response))
        .then((blob) => linkBuilder(blob, data.TITLE || "filename", "lyrx")
        )
}
export const getArcgisproWMTS = async (data: Geoservice) => {
    await fetch(routes.getArcgisproWMTS)
        .then((response) => parseArcgisWMSorWMTS(data, response))
        .then((blob) => linkBuilder(blob, data.TITLE || "filename", "lyrx")
        )
}
export const getQgisWFS = async (data: Geoservice) => {
    await fetch(routes.getQgisWFS)
        .then((response) => parseQgisTemplate(data, response))
        .then((blob) => linkBuilder(blob, data.TITLE || "filename", "qlr")
        )
}
export const getQgisWMS = async (data: Geoservice) => {
    await fetch(routes.getQgisWMS)
        .then((response) => parseQgisTemplate(data, response))
        .then((blob) => linkBuilder(blob, data.TITLE || "filename", "qlr")
        )
}
export const getQgisWMTS = async (data: Geoservice) => {
    await fetch(routes.getQgisWMTS)
        .then((response) => parseQgisTemplate(data, response))
        .then((blob) => linkBuilder(blob, data.TITLE || "filename", "qlr")
        )
}