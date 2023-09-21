import {BlockConfiguration} from "./block";

export class SubstringBlock extends BlockConfiguration {

    category = 'Text';
    name = "substring";
    json = {
        "message0": "substring %1 from %2 to %3",
        "args0": [
            {
                "type": "input_value",
                "name": "STR"
            },
            {"type": "field_number", "name": "START", "min": 0},
            {"type": "field_number", "name": "END", "min": 0}
        ],
        // "previousStatement": null,
        // "nextStatement": null,
        "colour": 150,
        "output": "String",
    };

    expression(block, generator) {
        const str = generator.valueToCode(block, 'STR', 0);
        const start = block.getFieldValue("START");
        let end = block.getFieldValue("END");
        console.log(end);
        if (end == '') {
            end = str.length;
        }
        const code = '${bean:StringUtil?method=substring("' + str + '",' + start + ',' + end + ')}';
        return [code, 0];
    }
}
