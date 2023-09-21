import {BlockConfiguration} from "./block";

export class ListIsEmptyBlock extends BlockConfiguration {

    category = 'List';
    name = "listsIsEmpty";
    json = {
        "message0": "isEmpty of %1",
        "args0": [
            {"type": "input_value", "name": "RIGHT", "inputsInline": true},
        ],
        "colour": 60,
        "inputsInline": true,
        "output": "boolean",
    };

    expression(block, generator) {
        let right = generator.valueToCode(block, 'RIGHT', 0);
        console.log(right);
        if (right == '${bean:List?method=createList(\'[]\')}' || right == '${bean:Map?method=createListOfMap(\'[]\')}'){
            right = '[empty]';
        }
        const code = '${bean:List?method=isEmpty(' + right + ')}';
        return [code, 0];
    }
}
