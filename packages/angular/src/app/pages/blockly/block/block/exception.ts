import {BlockConfiguration} from "./block";

export class ExceptionBlock extends BlockConfiguration {
    category = 'System';
    name = "exception";
    json = {
        "message0": "Exception. %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["message", "message"],
                    ["stacktrace", "stacktrace"],
                ]
            }
        ],
        "colour": 360,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const op = block.getFieldValue("OP");
        const code = '${exception.' + op + '}';
        return [code, 0];
    }

}
