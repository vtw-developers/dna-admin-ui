import {BlockConfiguration} from "./block";

export class ListLengthBlock extends BlockConfiguration {

    category = 'List';
    name = "listsLength";
    json = {
        "type": "lists_length",
        "message0": "length of %1",
        "args0": [
            {"type": "input_value", "name": "RIGHT", "inputsInline": true},
        ],
        "colour": 60,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        let right = generator.valueToCode(block, 'RIGHT', 0);
        if (right == '${bean:List?method=createList(\'[]\')}' || right == '${bean:Map?method=createListOfMap(\'[]\')}'){
            right = 'empty';
        }
        const code = '${bean:List?method=lengthOf(' + right + ')}';
        return [code, 0];
    }
}
