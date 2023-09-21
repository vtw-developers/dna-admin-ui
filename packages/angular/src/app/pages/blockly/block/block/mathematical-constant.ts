import {BlockConfiguration} from "./block";

export class MathematicalConstantBlock extends BlockConfiguration {

    category = 'Math';
    name = "mathematicalConstant";
    json = {
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["π", "pi"],
                    ["e", "e"]
                ]
            },
        ],
        "colour": 210,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const op = block.getFieldValue("OP");
        console.log(op);
        const code = '${bean:Calculator?method=' + op + '()}';
        return [code, 0];
    }
}
