import {BlockConfiguration} from "./block";

export class RandomBlock extends BlockConfiguration {

    category = 'Math';
    name = "random";
    json = {
        "message0": "Random %1 %2 %3 ",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["Integer", "randomInt"],
                    ["Double", "randomDouble"],
                ]
            },
            {"type": "input_value", "name": "MIN", "inputsInline": true},
            {"type": "input_value", "name": "MAX", "inputsInline": true},
        ],
        "colour": 210,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const min = generator.valueToCode(block, 'MIN', 0);
        const max = generator.valueToCode(block, 'MAX', 0);
        const op = block.getFieldValue("OP");
        console.log(op);
        const code = '${bean:Calculator?method=' + op + '(' + min + ',' + max + ')}';
        return [code, 0];
    }
}
