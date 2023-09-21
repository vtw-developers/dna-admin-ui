import {BlockConfiguration} from "./block";

export class BooleanBlock extends BlockConfiguration {

    category = 'Operator';
    name = "boolean";
    json = {
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "BOOLEAN",
                "inputsInline": true,
                "options": [
                    ["true", "true"],
                    ["false", "false"]
                ]
            }
        ],
        "colour": 30,
        "inputsInline": true,
        "output": "Boolean",
    };

    expression(block, generator) {
        const boolean = block.getFieldValue("BOOLEAN");
        console.log(boolean);
        let code = boolean;
        return [code, 0];
    }
}
