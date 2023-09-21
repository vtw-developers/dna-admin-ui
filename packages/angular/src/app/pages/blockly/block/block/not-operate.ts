import {BlockConfiguration} from "./block";

export class NotOperateBlock extends BlockConfiguration {

    category = 'Compare';
    name = "notOperate";
    json = {
        "message0": "NOT %1",
        "args0": [
            {"type": "input_value", "name": "BOOL", "inputsInline": true},
        ],
        "colour": 330,
        "inputsInline": true,
        "output": "Boolean",
    };

    expression(block, generator) {
        const bool = generator.valueToCode(block, 'BOOL', 0);
        let code = '${bean:Operator?method=notOperate(' + bool + ')}';
        return [code, 0];
    }
}
