import {BlockConfiguration} from "./block";

export class LastIndexOfBlock extends BlockConfiguration {

    category = 'Text';
    name = "lastIndexOf";
    json = {
        "message0": "lastIndexOf %1, %2",
        "args0": [
            {"type": "input_value", "name": "STR"},
            {"type": "field_input", "name": "SPECIFIC STR"},
        ],
        // "previousStatement": null,
        // "nextStatement": null,
        "colour": 150,
        "output": "Number",
    };

    expression(block, generator) {
        const str = generator.valueToCode(block, 'STR', 0);
        const specStr = block.getFieldValue("SPECIFIC STR");
        const code = '${bean:StringUtil?method=lastIndexOf(\'' + str + '\',' + specStr + ')}';
        return [code, 0];
    }
}
