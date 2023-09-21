import {BlockConfiguration} from "./block";

export class VariableDotBlock extends BlockConfiguration {

    category = 'Variables';
    name = "variableDot";
    json = {
        "type": "variableDot",
        "message0": ". %1 %2",
        "args0": [
            {"type": "field_input", "name": "VARIABLE", "spellcheck": false},
            {"type": "input_value", "name": "CHILD", "inputsInline": true},
        ],
        "colour": 90,
        "output": "String",
    };

    expression(block, generator) {
        const variable = block.getFieldValue("VARIABLE");
        const child = generator.valueToCode(block, 'CHILD', 0);
        let code = '';
        if (child.length > 0) {
            code = '.' + variable + child;
        } else {
            code = '.' + variable;
        }
        return [code, 0];
    }
}
