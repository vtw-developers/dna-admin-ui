import {BlockConfiguration} from "./block";

export class NormalizeSpaceBlock extends BlockConfiguration {

    category = 'Text';
    name = "normalizeSpace";
    json = {
        "message0": "normalizeSpace %1",
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
        const code = '${bean:StringUtil?method=normalizeSpace(' + str + ')}';
        return [code, 0];
    }
}
