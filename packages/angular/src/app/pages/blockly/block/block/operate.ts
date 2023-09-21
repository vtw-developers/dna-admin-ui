import {BlockConfiguration} from "./block";

export class OperateBlock extends BlockConfiguration {

    category = 'Operator';
    name = 'operate';
    json = {
        "message0": "%1 %2 %3",
        "args0": [
            {"type": "input_value", "name": "LEFT", "inputsInline": true},
            {

                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["==", "=="],
                    ["=~", "=~"],
                    [">", ">"],
                    [">=", ">="],
                    ["<", "<"],
                    ["<=", "<="],
                    ["!=", "!="],
                    ["!=~", "!=~"],
                    ["contains", "contains"],
                    ["!contains", "!contains"],
                    ["~~", "~~"],
                    ["!~~", "!~~"],
                    ["regex", "regex"],
                    ["!regex", "!regex"],
                    ["in", "in"],
                    ["!in", "!in"],
                    ["is", "is"],
                    ["!is", "!is"],
                    ["range", "range"],
                    ["!range", "!range"],
                    ["startsWith", "startsWith"],
                    ["endsWith", "endsWith"]
                ]
            },
            {"type": "input_value", "name": "RIGHT", "inputsInline": true},
        ],
        "colour": 30,
        "inputsInline": true,
        "output": "Boolean",
    };

    expression(block, generator) {
        const left = generator.valueToCode(block, 'LEFT', 0);
        const right = generator.valueToCode(block, 'RIGHT', 0);
        const op = block.getFieldValue("OP");
        const code = left + ' ' + op + ' ' + right;
        return [code, 0];
    }

}
