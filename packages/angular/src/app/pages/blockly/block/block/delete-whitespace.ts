import {BlockConfiguration} from "./block";

export class DeleteWhitespaceBlock extends BlockConfiguration {

    category = 'Text';
    name = "deleteWhitespace";
    json = {
        "message0": "deleteWhitespace %1",
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
        const code = '${bean:StringUtil?method=deleteWhitespace(' + str + ')}';
        return [code, 0];
    }
}
