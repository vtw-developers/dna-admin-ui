import {BlockConfiguration} from "./block";

export class IncrementOperateBlock extends BlockConfiguration {

    category = 'Math';
    name = "incrementOperate";
    json = {
        "message0": "%1 %2",
        "args0": [
            {"type": "input_value", "name": "LEFT", "inputsInline": true},
            {
                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["++", "increase"],
                    ["--", "decrease"]
                ]
            }
        ],
        "colour": 210,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const left = generator.valueToCode(block, 'LEFT', 0);
        const op = block.getFieldValue("OP");
        console.log(op);
        const code = '${bean:Calculator?method=' + op + '(' + left + ')}';
        return [code, 0];
    }
}
