import {BlockConfiguration} from "./block";

export class ReplaceBlock extends BlockConfiguration {

    category = 'Text';
    name = "replace";
    json = {
        "message0": "replace %1, %2 to %3",
        "args0": [
            {"type": "input_value", "name": "STR"},
            {"type": "field_input", "name": "TARGET STR"},
            {"type": "field_input", "name": "REPLACE STR"},
        ],
        // "previousStatement": null,
        // "nextStatement": null,
        "colour": 150,
        "output": "String",
    };

    expression(block, generator) {
        const str = generator.valueToCode(block, 'STR', 0);
        const targetStr = block.getFieldValue("TARGET STR");
        const replaceStr = block.getFieldValue("REPLACE STR");
        const code = '${bean:StringUtil?method=replace(' + str + ',' + targetStr + ',' + replaceStr + ')}';
        return [code, 0];
    }
}
