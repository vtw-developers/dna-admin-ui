import {BlockConfiguration} from "./block";

export class NullOperateBlock extends BlockConfiguration {

    category = 'Operator';
    name = "nullOperate";
    json = {
        "message0": "%1 %2",
        "args0": [
            {"type": "input_value", "name": "LEFT", "inputsInline": true},
            {

                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["isNull", "isNull"],
                    ["isNotNull", "isNotNull"]
                ]
            }
        ],
        "colour": 30,
        "inputsInline": true,
        "output": "Boolean",
    };

    expression(block, generator) {
        const left = generator.valueToCode(block, 'LEFT', 0);
        const op = block.getFieldValue("OP");
        console.log(op);
        let code = '';
        if (op == 'isNull') {
            code = left + ' == null';
        } else if (op == 'isNotNull') {
            code = left + ' != null';
        }
        return [code, 0];
    }
}
