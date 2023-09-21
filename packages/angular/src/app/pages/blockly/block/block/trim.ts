import {BlockConfiguration} from "./block";

export class TrimBlock extends BlockConfiguration {

    category = 'Text';
    name = "trim";
    json = {
        "message0": "trim %1",
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
        const code = '${bean:StringUtil?method=trim(' + str + ')}';
        return [code, 0];
    }
}
