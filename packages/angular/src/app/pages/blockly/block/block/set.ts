import {BlockConfiguration} from "./block";

export class SetBlock extends BlockConfiguration {

    category = 'Math';
    name = "set";
    json = {
        "message0": "set %1 %2 %3",
        "args0": [
            {"type": "input_value", "name": "LEFT", "inputsInline": true},
            {
                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["union", "union"],
                    ["diff", "diff"],
                ]
            },
            {"type": "input_value", "name": "RIGHT", "inputsInline": true},
        ],
        "colour": 210,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        let left = generator.valueToCode(block, 'LEFT', 0);
        let right = generator.valueToCode(block, 'RIGHT', 0);
        const op = block.getFieldValue("OP");
        const code = '${bean:List?method=set('+left+',' + right + ', '+op+')}';
        return [code, 0];
    }
}
