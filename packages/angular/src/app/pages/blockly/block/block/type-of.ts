import {BlockConfiguration} from "./block";

export class TypeOfBlock extends BlockConfiguration {

    category = 'Compare';
    name = "typeOf";
    json = {
        "message0": "typeOf %1 ",
        "args0": [
            {"type": "input_value", "name": "RIGHT", "inputsInline": true},
        ],
        "colour": 330,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const right = generator.valueToCode(block, 'RIGHT', 0);
        console.log(right);

        const code = '${bean:Operator?method=typeOf(' + right + ')}';
        return [code, 0];
    }
}
