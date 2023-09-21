import {BlockConfiguration} from "./block";

export class RemoveBlock extends BlockConfiguration {

    category = 'Text';
    name = "remove";
    json = {
        "message0": "remove %1, %2",
        "args0": [
            {"type": "input_value", "name": "STR"},
            {"type": "field_input", "name": "DELETE STR"},
        ],
        // "previousStatement": null,
        // "nextStatement": null,
        "colour": 150,
        "output": "Number",
    };

    expression(block, generator) {
        const str = generator.valueToCode(block, 'STR', 0);
        const deleteStr = block.getFieldValue("DELETE STR");
        const code = '${bean:StringUtil?method=remove(' + str + ',' + deleteStr + ')}';
        return [code, 0];
    }
}
