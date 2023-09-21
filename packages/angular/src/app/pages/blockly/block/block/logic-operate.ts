import {BlockConfiguration} from "./block";

export class LogicOperateBlock extends BlockConfiguration{

    category = 'Operator';
    name = 'logicOperate';
    json = {
        "message0": "%1 %2 %3",
        "args0": [
            {"type": "input_value", "name": "LEFT", "inputsInline": true},
            {

                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["&&", "&&"],
                    ["||", "||"]
                ]
            },
            {"type": "input_value", "name": "RIGHT", "inputsInline": true},
        ],
        "colour": 30,
        "inputsInline": true,
        "output": "Boolean",
    };

    expression(block, generator) {
        const left = generator.valueToCode(block, 'LEFT', 0);
        const right = generator.valueToCode(block, 'RIGHT', 0);
        const op = block.getFieldValue("OP");
        console.log(op);
        const code = left + ' ' + op + ' ' + right;
        return [code, 0];
    }

}
