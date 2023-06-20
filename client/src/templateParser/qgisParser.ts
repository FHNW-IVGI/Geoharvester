import { Geoservice } from "../types";

export const parseQgisTemplate = async (data: Geoservice, response: any) => {
    let projectXml = await response.text()
    const bboxArray = data.bbox.split(" ");
    const xmin = bboxArray[0];
    const ymin = bboxArray[1];
    const xmax = bboxArray[2];
    const ymax = bboxArray[3];
    const urlParts = data.endpoint.split("/")
    const serviceSnippet = `${urlParts[0]}//${urlParts[2]}/`.trim()
    projectXml = projectXml.replace("{{endpoint}}", serviceSnippet);
    projectXml = projectXml.replace("{{name}}", data.name);
    projectXml = projectXml.replace("{{name}}", data.name);
    projectXml = projectXml.replace("{{title}}", data.title);
    projectXml = projectXml.replace("{{provider}}", data.provider);
    projectXml = projectXml.replace("{{XMAX}}", xmax);
    projectXml = projectXml.replace("{{YMAX}}", ymax);
    projectXml = projectXml.replace("{{YMIN}}", ymin);
    projectXml = projectXml.replace("{{XMIN}}", xmin);

    return new Blob([projectXml], {
        type: "application/xml"
    });

}
