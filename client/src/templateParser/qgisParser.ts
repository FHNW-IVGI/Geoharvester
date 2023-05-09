import { Geoservice } from "../types";

export const parseQgisTemplate = async (data: Geoservice, response: any) => {
    let projectXml = await response.text()
    const bboxArray = data.BBOX.split(" ");
    const xmin = bboxArray[0];
    const ymin = bboxArray[1];
    const xmax = bboxArray[2];
    const ymax = bboxArray[3];
    const urlParts = data.SERVICELINK.split("/")
    const serviceSnippet = `${urlParts[0]}//${urlParts[2]}/`.trim()
    projectXml = projectXml.replace("{{SERVICELINK}}", serviceSnippet);
    projectXml = projectXml.replace("{{NAME}}", data.NAME);
    projectXml = projectXml.replace("{{NAME}}", data.NAME);
    projectXml = projectXml.replace("{{TITLE}}", data.TITLE);
    projectXml = projectXml.replace("{{OWNER}}", data.OWNER);
    projectXml = projectXml.replace("{{XMAX}}", xmax);
    projectXml = projectXml.replace("{{YMAX}}", ymax);
    projectXml = projectXml.replace("{{YMIN}}", ymin);
    projectXml = projectXml.replace("{{XMIN}}", xmin);

    return new Blob([projectXml], {
        type: "application/xml"
    });

}
