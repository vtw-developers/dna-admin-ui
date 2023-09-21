import {BlockConfiguration} from "./block";

export class MapGetKeyBlock extends BlockConfiguration {

    category = 'Map';
    name = "mapGetKey";
    json = {
        "type": "lists_length",
        "message0": "keySet %1",
        "args0": [
            {"type": "input_value", "name": "RIGHT", "inputsInline": true},
        ],
        "colour": 180,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        let result = generator.valueToCode(block, 'RIGHT', 0);
        const code = '${bean:Map?method=getMapKeys(\'' + result + '\')}';
        return [code, 0];
    }
}
