import {BlockConfiguration} from "./block";

export class HostnameBlock extends BlockConfiguration {
    category = 'System';
    name = "hostname";
    json = {
        "message0": "hostname",
        "colour": 360,
        //"inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const code = '${hostname}';
        return [code, 0];
    }
}
