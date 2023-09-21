import {BlockConfiguration} from "./block";

export class AppendBlock extends BlockConfiguration {

    category = 'Text';
    name = "append";
    json = {
        "message0": "append %1, %2",
        "args0": [
            {"type": "input_value", "name": "STR"},
            {"type": "field_input", "name": "APPEND STR"},
        ],
        // "previousStatement": null,
        // "nextStatement": null,
        "colour": 150,
        "output": "String",
    };

    expression(block, generator) {
        const str = generator.valueToCode(block, 'STR', 0);
        const appendStr = block.getFieldValue("APPEND STR");
        const code = '${bean:StringUtil?method=append(' + str + ',' + appendStr + ')}';
        return [code, 0];
    }
}
