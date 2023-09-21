import {BlockConfiguration} from "./block";

export class MapBlock extends BlockConfiguration {

    category = 'Map';
    name = "map";
    json = {
        "message0": "Key: %1 Value: %2",
        "args0": [
            {"type": "input_value", "name": "KEY"},
            {"type": "input_value", "name": "VALUE"},
        ],
        // "previousStatement": null,
        // "nextStatement": null,
        "colour": 180,
        "inputsInline": true,
        "output": "String",
    };

    override expression(block, generator) {
        const key = generator.valueToCode(block, 'KEY', 0);
        const value = generator.valueToCode(block, 'VALUE', 0);
        const code = `"${key}": "${value}"`;
        return [code, 0];
    }
}
