import {BlockConfiguration} from "./block";

export class BodyBlock extends BlockConfiguration {

    category = 'Variables';
    name = "body";
    json = {
        "type": "body",
        "message0": "result",
        "colour": 90,
        "output": "String",
    };

    expression(block, generator) {
        //const variable = generator.valueToCode(block, 'VARIABLE', 0);
        let code = '${body}';
        /*if (variable.length > 0) {
            code = '${body' + variable + '}';
        } else {
            code = '${body}';
        }*/
        return [code, 0];
    }
}
