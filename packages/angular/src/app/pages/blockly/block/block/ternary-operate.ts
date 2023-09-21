import {BlockConfiguration} from "./block";

export class TernaryOperateBlock extends BlockConfiguration {

    category = 'Compare';
    name = "ternaryOperate";
    json = {
        "message0": "%1 ? %2 : %3",
        "args0": [
            {"type": "input_value", "name": "RESULT", "inputsInline": true},
            {"type": "input_value", "name": "TRUE", "inputsInline": true},
            {"type": "input_value", "name": "FALSE", "inputsInline": true},
        ],
        "colour": 330,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const result = generator.valueToCode(block, 'RESULT', 0);
        const trueValue = generator.valueToCode(block, 'TRUE', 0);
        const falseValue = generator.valueToCode(block, 'FALSE', 0);
        //let code = result + ' ? ' + trueValue + ' : ' + falseValue;
        const code = '${bean:Operator?method=ternary(\''+result+'\',\''+trueValue+'\',\''+falseValue+'\')}';
        return [code, 0];
    }
}
