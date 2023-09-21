import {BlockConfiguration} from "./block";

export class PropertyBlock extends BlockConfiguration {

    category = 'Variables';
    name = "property";
    json = {
        "type": "property",
        "message0": "field.%1 %2",
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
        if (child.length > 0 || variable.length > 0) {
            code = '${exchangeProperty.' + variable + child + '}';
        } else {
            code = '${exchangeProperty}';
        }
        return [code, 0];
    }
}
