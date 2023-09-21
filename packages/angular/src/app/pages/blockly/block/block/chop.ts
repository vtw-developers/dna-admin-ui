import {BlockConfiguration} from "./block";

export class ChopBlock extends BlockConfiguration {

    category = 'Text';
    name = "chop";
    json = {
        "message0": "chop %1",
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
        const code = '${bean:StringUtil?method=chop(' + str + ')}';
        return [code, 0];
    }
}
