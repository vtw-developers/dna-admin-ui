import {BlockConfiguration} from "./block";

export class ChangeBlock extends BlockConfiguration {

    category = 'Variables';
    name = "change";
    json = {
        "message0": "%1 Change to %2",
        "args0": [
            {"type": "input_value", "name": "LEFT"},
            {"type": "input_value", "name": "RIGHT"},
        ],
        // "previousStatement": null,
        // "nextStatement": null,
        "colour": 90,
        "inputsInline": true,
        "output": "String",
    };

    override expression(block, generator) {
        const left = generator.valueToCode(block, 'LEFT', 0);
        const right = generator.valueToCode(block, 'RIGHT', 0);
        const code = '${bean:Variable?method=change('+left+',' + right + ')}';
        return [code, 0];
    }
}
