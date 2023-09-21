import {BlockConfiguration} from "./block";

export class UpperCaseBlock extends BlockConfiguration {

    category = 'Text';
    name = "upperCase";
    json = {
        "message0": "upperCase %1",
        "args0": [
            {"type": "input_value", "name": "STR"},
        ],
        // "previousStatement": null,
        // "nextStatement": null,
        "colour": 150,
        "output": "String",
    };

    expression(block, generator) {
        const str = generator.valueToCode(block, 'STR', 0);
        const code = '${bean:StringUtil?method=upperCase(' + str + ')}';
        return [code, 0];
    }
}
