import * as ko from "knockout";
import { CdfTransformer } from "./cdftransformer";
import "./_sass/jekyll-theme-tactile.scss";
import { Message } from "./message";
// sample file for import, must appear at top?
import sampleData from "./xml/cvrv1_example1.json";
import formatConfig from "./config.json";

class CdfConverterViewModel {
    supportedFormats: ko.ObservableArray<any>
    commonDataFormat: ko.Observable<string>
    inputText: ko.Observable<string>
    outputText: ko.Observable<string>
    messages: ko.ObservableArray<Message>
    transform() {
        //incoming data from SaxonJS
        var transformCallback = (fragment: DocumentFragment) => {
            // have to convert to string?
            var div = document.createElement('div');
            div.appendChild(fragment.cloneNode(true));
            // replace existing output content
            this.outputText(div.innerHTML);
            this.messages.unshift(new Message("Conversion completed."));
        }
        const inputFormat = formatConfig.filter(o => o.nameAbbreviation + o.version === this.commonDataFormat())[0];
        if (inputFormat) {
            this.messages.unshift(new Message("Conversion started."));
            const sefFile = inputFormat.transforms.filter(o => o.name = "json2xml")[0].sef
            CdfTransformer.transform(this.inputText(), sefFile, transformCallback);
        }
    }
    constructor() {
        const supportedFormats = formatConfig.map((o) => {
            return { name: `${o.name} ${o.version}`, value: `${o.nameAbbreviation}${o.version}` }
        });

        this.supportedFormats = ko.observableArray(supportedFormats);
        this.commonDataFormat = ko.observable<string>("");
        this.inputText = ko.observable<string>("");
        this.outputText = ko.observable<string>("");
        this.messages = ko.observableArray([new Message("Tool initialized.")]);
    }
    loadSample() {
        const sampleFormat = "cvrv1.0.0";
        this.commonDataFormat(sampleFormat)
        // do pretty print
        this.inputText(JSON.stringify(sampleData, null, 2));
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
