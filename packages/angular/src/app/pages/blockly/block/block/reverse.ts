import {BlockConfiguration} from "./block";

export class ReverseBlock extends BlockConfiguration {

    category = 'Text';
    name = "reverse";
    json = {
        "message0": "reverse %1",
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
        const code = '${bean:StringUtil?method=reverse(' + str + ')}';
        return [code, 0];
    }
}
