import { Geoservice } from "../types";

export const parseArcgisWFS = async (data: Geoservice, response: any) => {
    let projectJson = await response.text()
    let name = data.name

    name = name.replace(/ms:/g, ''); // removes all occurrences of "ms:"
    name = name.replace(/\./g, '_'); // replaces all "." with "_"
    name = name.replace(/-/g, '_'); // replaces all "-" with "_"

    const urlParts = data.endpoint.split("/")
    const serviceSnippet = `${urlParts[0]}//${urlParts[2]}/`.trim()
    projectJson = projectJson.replace("{{endpoint}}", serviceSnippet);
    projectJson = projectJson.replace("{{name}}", name);
    projectJson = projectJson.replace("{{name}}", name);
    projectJson = projectJson.replace("{{title}}", data.title);

    return new Blob([projectJson], {
        type: "application/json"
    });

}

export const parseArcgisWMSorWMTS = async (data: Geoservice, response: any) => {
    let projectJson = await response.text()
    const urlParts = data.endpoint.split("/")
    const serviceSnippet = `${urlParts[0]}//${urlParts[2]}/`.trim()
    projectJson = projectJson.replace("{{endpoint}}", serviceSnippet);
    projectJson = projectJson.replace("{{name}}", data.name);
    projectJson = projectJson.replace("{{name}}", data.name);
    projectJson = projectJson.replace("{{title}}", data.title);
    projectJson = projectJson.replace("{{provider}}", data.provider);

    const result = new Blob([projectJson], {
        type: "application/json"
    });

    return result

}
