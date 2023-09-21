import {BlockConfiguration} from "./block";

export class TrigonometricFunctionBlock extends BlockConfiguration {

    category = 'Math';
    name = "trigonometric";
    json = {
        "message0": "%1 %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["sin", "sin"],
                    ["cos", "cos"],
                    ["tan", "tan"]
                ]
            },
            {"type": "input_value", "name": "RIGHT", "inputsInline": true}
        ],
        "colour": 210,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const right = generator.valueToCode(block, 'RIGHT', 0);
        const op = block.getFieldValue("OP");
        console.log(op);
        const code = '${bean:Calculator?method=' + op + '(' + right + ')}';
        return [code, 0];
    }
}
