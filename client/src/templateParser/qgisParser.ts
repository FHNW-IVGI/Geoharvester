import { Geoservice } from "../types";

export const parseQgisWFS = async (data: Geoservice, response: any) => {
    let projectXml = await response.text()
    console.log(projectXml)
    const bboxArray = data.BBOX.split(" ");
    const xmin = bboxArray[0];
    const ymin = bboxArray[1];
    const xmax = bboxArray[2];
    const ymax = bboxArray[3];
    // let projectXml = xhr.responseText;
    projectXml = projectXml.replace("{{SERVICELINK}}", data.SERVICELINK.trim());
    projectXml = projectXml.replace("{{NAME}}", data.NAME);
    projectXml = projectXml.replace("{{NAME}}", data.NAME);
    projectXml = projectXml.replace("{{TITLE}}", data.TITLE);
    projectXml = projectXml.replace("{{OWNER}}", data.OWNER);
    projectXml = projectXml.replace("{{XMAX}}", xmax);
    projectXml = projectXml.replace("{{YMAX}}", ymax);
    projectXml = projectXml.replace("{{YMIN}}", ymin);
    projectXml = projectXml.replace("{{XMIN}}", xmin);

    console.log(projectXml)
    return new Blob([projectXml], {
        type: "application/json"
    });

}