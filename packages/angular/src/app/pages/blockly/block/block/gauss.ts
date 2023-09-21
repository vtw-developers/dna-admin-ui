import {BlockConfiguration} from "./block";

export class GaussBlock extends BlockConfiguration {

    category = 'Math';
    name = "gauss";
    json = {
        "message0": "%1 %2, digit %3 ",
        "args0": [
            {"type": "input_value", "name": "LEFT", "inputsInline": true},
            {
                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["⌈ ⌉", "ceil"],
                    ["⌊ ⌋", "floor"],
                    ["⌈⌊ ⌋⌉", "round"]
                ]
            },
            {"type": "input_value", "name": "RIGHT", "inputsInline": true},
        ],
        "colour": 210,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const left = generator.valueToCode(block, 'LEFT', 0);
        const right = generator.valueToCode(block, 'RIGHT', 0);
        const op = block.getFieldValue("OP");
        console.log(op);
        const code = '${bean:Calculator?method=' + op + '(' + left + ',' + right + ')}';
        return [code, 0];
    }
}
