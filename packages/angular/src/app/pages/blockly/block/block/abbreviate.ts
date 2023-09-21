import {BlockConfiguration} from "./block";

export class AbbreviateBlock extends BlockConfiguration {

    category = 'Text';
    name = "abbreviate";
    json = {
        "message0": "abbreviate %1 from %2",
        "args0": [
            {"type": "input_value", "name": "STR"},
            {"type": "field_number", "name": "MAX WIDTH", "min": 4},
        ],
        // "previousStatement": null,
        // "nextStatement": null,
        "colour": 150,
        "output": "String",
    };

    expression(block, generator) {
        const str = generator.valueToCode(block, 'STR', 0);
        const maxWidth = block.getFieldValue("MAX WIDTH");
        const code = '${bean:StringUtil?method=abbreviate(' + str + ',' + maxWidth + ')}';
        return [code, 0];
    }
}
