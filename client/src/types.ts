/**
 * Interfaces are based on the schema definition in server/app/redis/schemas
 * As the data is transmitted via JSON string, all field types are now strings.
 * 
 */

import { PROVIDERTYPE, SERVICETYPE } from "./constants";

export interface Geoservice {
    OWNER: PROVIDERTYPE;
    TITLE: string;
    NAME: string;
    MAPGEO: string;
    TREE: string;
    GROUP: string;
    ABSTRACT: string;
    KEYWORDS: string;
    LEGEND: string;
    CONTACT: string;
    SERVICELINK: string;
    METADATA: string;
    UPDATE: string;
    SERVICETYPE: SERVICETYPE;
    MAX_ZOOM: number;
    CENTER_LAT: string;
    CENTER_LON: string;
    BBOX: string;
    METAQUALITY: number;
}

export interface Geodata {
    OWNER: PROVIDERTYPE;
    TITLE: string;
    NAME: string;
    MAPGEO: string;
    ABSTRACT: string;
    KEYWORDS: string;
    CONTACT: string;
    WMSGetCap: string;
    WMTSGetCap: string;
    WFSGetCap: string;
}