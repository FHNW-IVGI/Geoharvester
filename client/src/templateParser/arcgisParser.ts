import { Geoservice } from "../types";

export const parseArcgisWFS = async (data: Geoservice, response: any) => {
    let projectJson = await response.text()
    let name = data.NAME

    name = name.replace(/ms:/g, ''); // removes all occurrences of "ms:"
    name = name.replace(/\./g, '_'); // replaces all "." with "_"
    name = name.replace(/-/g, '_'); // replaces all "-" with "_"

    const urlParts = data.SERVICELINK.split("/")
    const serviceSnippet = `${urlParts[0]}//${urlParts[2]}/`.trim()
    projectJson = projectJson.replace("{{SERVICELINK}}", serviceSnippet);
    projectJson = projectJson.replace("{{NAME}}", name);
    projectJson = projectJson.replace("{{NAME}}", name);
    projectJson = projectJson.replace("{{TITLE}}", data.TITLE);

    return new Blob([projectJson], {
        type: "application/json"
    });

}

export const parseArcgisWMSorWMTS = async (data: Geoservice, response: any) => {
    let projectJson = await response.text()
    const urlParts = data.SERVICELINK.split("/")
    const serviceSnippet = `${urlParts[0]}//${urlParts[2]}/`.trim()
    projectJson = projectJson.replace("{{SERVICELINK}}", serviceSnippet);
    projectJson = projectJson.replace("{{NAME}}", data.NAME);
    projectJson = projectJson.replace("{{NAME}}", data.NAME);
    projectJson = projectJson.replace("{{TITLE}}", data.TITLE);
    projectJson = projectJson.replace("{{OWNER}}", data.OWNER);

    const result = new Blob([projectJson], {
        type: "application/json"
    });

    return result

}
