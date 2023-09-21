import {BlockConfiguration} from "./block";

export class LenthBlock extends BlockConfiguration {

    category = 'Text';
    name = "length";
    json = {
        "message0": "length %1",
        "args0": [
            {"type": "input_value", "name": "STR"},
        ],
        // "previousStatement": null,
        // "nextStatement": null,
        "colour": 150,
        "output": "Number",
    };

    expression(block, generator) {
        const str = generator.valueToCode(block, 'STR', 0);
        const code = '${bean:StringUtil?method=length(' + str + ')}';
        return [code, 0];
    }
}
