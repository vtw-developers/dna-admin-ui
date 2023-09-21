import {BlockConfiguration} from "./block";

export class CompareOperateBlock extends BlockConfiguration {

    category = 'Compare';
    name = 'compare-operate';
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
                   // ["=~", "=~"],
                    [">", ">"],
                    [">=", ">="],
                    ["<", "<"],
                    ["<=", "<="],
                    ["!=", "!="],
                    /*["!=~", "!=~"],
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
                    ["endsWith", "endsWith"]*/
                ]
            },
            {"type": "input_value", "name": "RIGHT", "inputsInline": true},
        ],
        "colour": 330,
        "inputsInline": true,
        "output": "Boolean",
    };

    expression(block, generator) {
        const left = generator.valueToCode(block, 'LEFT', 0);
        const right = generator.valueToCode(block, 'RIGHT', 0);
        const op = block.getFieldValue("OP");
       // const code = left + ' ' + op + ' ' + right;
        const code = '${bean:Operator?method=operate(' + left + ',' + right + ',' +op+ ')}';
       /* let result;
        if(left != '' && right != ''){
            result = eval(code);
            return [result.toString(), 0];
        }*/
        return [code, 0];
    }

}
