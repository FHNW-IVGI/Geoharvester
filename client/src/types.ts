/**
 * Interfaces are based on the schema definition in server/app/redis/schemas
 * As the data is transmitted via JSON string, all field types are now strings.
 * 
 */

export interface Geoservice {
    provider: string;
    title: string;
    name: string;
    preview: string;
    tree: string;
    group: string;
    abstract: string;
    keywords: string;
    legend: string;
    contact: string;
    endpoint: string;
    metadata: string;
    update: string;
    service: string;
    maxZoom: number;
    centerLat: string;
    centerLon: string;
    bbox: string;
}

export interface Geodata {
    provider: string;
    title: string;
    name: string;
    preview: string;
    abstract: string;
    keywords: string;
    contact: string;
    WMSGetCap: string;
    WMTSGetCap: string;
    WFSGetCap: string;
}