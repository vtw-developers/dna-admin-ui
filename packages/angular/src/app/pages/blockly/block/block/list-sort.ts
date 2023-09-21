import {BlockConfiguration} from "./block";

export class ListSortBlock extends BlockConfiguration {

    category = 'List';
    name = "listSort";
    json = {
        "message0": "sort %1 %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["asc", "asc"],
                    ["desc", "desc"],
                ]
            },
            {"type": "input_value", "name": "RIGHT", "inputsInline": true},
        ],
        "colour": 60,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        let right = generator.valueToCode(block, 'RIGHT', 0);
        const op = block.getFieldValue("OP");
        const code = '${bean:List?method=sortList('+op+',' + right + ')}';
        return [code, 0];
    }
}
