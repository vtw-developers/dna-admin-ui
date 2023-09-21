import {BlockConfiguration} from "./block";

export class NumberCheckBlock extends BlockConfiguration {

    category = 'Math';
    name = "numberCheck";
    json = {
        "message0": "%1 isNumber",
        "args0": [
            {"type": "input_value", "name": "INPUT VALUE", "inputsInline": true}
        ],
        "colour": 210,
        "inputsInline": true,
        "output": "Boolean",
    };

    expression(block, generator) {
        const inputValue = generator.valueToCode(block, 'INPUT VALUE',0);
        let code = '';
        code = '${bean:Calculator?method=numberCheck('+inputValue+')}'
        return [code, 0];
    }
}
