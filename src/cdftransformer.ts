// we don't having SaxonJS typings right now
// must set `noImplicitAny` ts setting to false
//declare var SaxonJS: any;
import * as SaxonJS from "./Saxon-JS/SaxonJS.js";
export class CdfTransformer {

    public static transform(inputStr: string, sefFile: string, cb: Function) {
        // wrap the JSON in XML, as required by XSLT transform
        let wrappedJson = `<root xmlns="http://www.w3.org/2005/xpath-functions">${inputStr}</root>`;
        // this is a workaround to handle the XPathJS's need to access SaxonJS.
        globalThis.SaxonJS = SaxonJS;
        SaxonJS.transform({
            // sourceLocation: "xslt/err_xml2json_out.xml",
            sourceText: wrappedJson,
            stylesheetLocation: `xslt/${sefFile}`,
            initialTemplate: "start",
            destination: "application"
        }, cb);
    };
}
