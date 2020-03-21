import * as CodeMirror from "codemirror";
import * as ko from "knockout";
import { CdfTransformer } from "./cdftransformer";

class CdfConverterViewModel {
    supportedFormats: ko.ObservableArray<any>
    commonDataFormat: ko.Observable<string>
    inputText: ko.Observable<string>
    outputText: ko.Observable<string>
    transform() {
        let formatSef = {
            "errv20": {
                "json2xml": "errv2_json2xml.sef",
                "jsonschema": "",
            },
            "cvrv10": {
                "json2xml": "cvrv1_json2xml.sef"
            },
            "eelv10": {
                "json2xml": "eelv1_json2xml.sef"
            }
        } as any;
        let that = this;
        //incoming data from SaxonJS
        var cb = function (fragment: any) {
            console.log(new Date())
            // have to convert to string?
            var div = document.createElement('div');
            div.appendChild(fragment.cloneNode(true));
            // replace existing output content
            //outputEditor.setValue(div.innerHTML);
            that.outputText(div.innerHTML);
            console.log(new Date())
        }
        const inputFormat = formatSef[this.commonDataFormat()].json2xml;
        CdfTransformer.transform(this.inputText(), inputFormat, cb);
    }
    constructor() {
        //this.supportedFormatsNames = ko.observableArray(["Election Results Reporting v2.0", "Cast Vote Records v1.0"]);
        this.supportedFormats = ko.observableArray([{ name: "Election Results Reporting v2.0", value: "errv20" }, { name: "Cast Vote Records v1.0", value: "cvrv10" }]);
        this.commonDataFormat = ko.observable<string>("");
        this.inputText = ko.observable<string>("content here");
        this.outputText = ko.observable<string>("output here");
    }
}


window.onload = () => {
    // initialize the input area
    //   const inputArea = document.getElementById("cdf-input") as HTMLTextAreaElement;

    //  var inputEditor = CodeMirror.fromTextArea(inputArea, {
    //      lineNumbers: true,
    //      mode: "application/json"
    //  });

    ko.applyBindings(new CdfConverterViewModel());

    // add handler for upload button
    // const loadFile = (input: any) => {
    //     var reader = new FileReader();
    //     reader.onload = function (e) {
    //         inputEditor.setValue(e.target.result);
    //     };
    //     reader.readAsText(input.files[0]);
    // };
    // wire up handler
    // var uploadBtn = document.getElementById("uploadBtn");
    // uploadBtn.onclick = loadFile;

    // code for generating XML output
    //   var htmlOutput = document.getElementById("cdf-output") as HTMLTextAreaElement;
    //   var outputEditor = CodeMirror.fromTextArea(htmlOutput, {
    //       lineNumbers: true,
    //       mode: "text/xml"
    //   });

};
