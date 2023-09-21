import {BlockConfiguration} from "./block";

export class LowerCaseBlock extends BlockConfiguration {

    category = 'Text';
    name = "lowerCase";
    json = {
        "message0": "lowerCase %1",
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
        const code = '${bean:StringUtil?method=lowerCase(' + str + ')}';
        return [code, 0];
    }
}
