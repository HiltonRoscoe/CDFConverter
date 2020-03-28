import * as ko from "knockout";
import { CdfTransformer } from "./cdftransformer";
import "./_sass/jekyll-theme-tactile.scss";
import { Message } from "./message";
// sample file for import, must appear at top?
import sample from "./xml/cvr.json";

class CdfConverterViewModel {
    supportedFormats: ko.ObservableArray<any>
    commonDataFormat: ko.Observable<string>
    inputText: ko.Observable<string>
    outputText: ko.Observable<string>
    messages: ko.ObservableArray<Message>
    transform() {
        let formatSef = {
            "errv20": {
                "json2xml": "errv2_json2xml.sef",
                "jsonschema": "",
            },
            "cvrv10": {
                "json2xml": "cvrv1_json2xml.sef",
                "example": "cvrv1_example1.json"
            },
            "eelv10": {
                "json2xml": "eelv1_json2xml.sef"
            }
        };
        let that = this;
        //incoming data from SaxonJS
        var transformCallback = (fragment: DocumentFragment) => {
            // have to convert to string?
            var div = document.createElement('div');
            div.appendChild(fragment.cloneNode(true));
            // replace existing output content
            that.outputText(div.innerHTML);
            that.messages.unshift(new Message("Conversion completed."));
        }
        const inputFormat = formatSef[this.commonDataFormat()].json2xml;
        this.messages.unshift(new Message("Conversion started."));
        CdfTransformer.transform(this.inputText(), inputFormat, transformCallback);
    }
    constructor() {
        this.supportedFormats = ko.observableArray([
            { name: "Cast Vote Records v1.0", value: "cvrv10" },
            { name: "Election Results Reporting v2.0", value: "errv20" }]);
        this.commonDataFormat = ko.observable<string>("");
        this.inputText = ko.observable<string>("");
        this.outputText = ko.observable<string>("");
        this.messages = ko.observableArray([new Message("Tool initialized.")]);
    }
    loadSample() {
        this.commonDataFormat("cvrv10")
        this.inputText(JSON.stringify(sample));
        this.outputText("");
    }
}

window.onload = () => {
    const vm = new CdfConverterViewModel();
    ko.applyBindings(vm);
    // SaxonJS will not invoke callback if there is an error in input
    // so we must catch the uncaught error and inform user
    window.onerror = (errorMsg, url, lineNumber) => {
        vm.messages.unshift(new Message(errorMsg.toString(), "error"));
        vm.messages.unshift(new Message("Conversion terminated."));
        return false;
    }
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
};
