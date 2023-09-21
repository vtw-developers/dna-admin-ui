import {BlockConfiguration} from "./block";

export class UncapitalizeBlock extends BlockConfiguration {

    category = 'Text';
    name = "uncapitalize";
    json = {
        "message0": "uncapitalize %1",
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
        const code = '${bean:StringUtil?method=uncapitalize(' + str + ')}';
        return [code, 0];
    }
}
