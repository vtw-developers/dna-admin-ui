import {BlockConfiguration} from "./block";

export class NullBlock extends BlockConfiguration {

    category = 'Text';
    name = "null";
    json = {
        "message0": "NULL",
        "colour": 150,
        //"inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const code = '${bean:StringUtil?method=setNull()}';
        return [code, 0];
    }
}
