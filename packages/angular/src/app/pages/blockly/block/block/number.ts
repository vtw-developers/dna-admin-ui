import {BlockConfiguration} from "./block";

export class NumberBlock extends BlockConfiguration {

    category = 'Math';
    name = "number";
    json = {
        "message0": "%1",
        "args0": [
            {
                "type": "field_number",
                "name": "VARIABLE",
                "spellcheck": false
            }
        ],
        "colour": 210,
        "output": "String",
    };

    expression(block, generator) {
        const text = block.getFieldValue("VARIABLE");
        let code = text;
        if (code === 0) {
            code = '0';
        }
        return [code, 0];
    }
}
