import {BlockConfiguration} from "./block";

export class ThreadNameBlock extends BlockConfiguration {
    category = 'System';
    name = "threadName";
    json = {
        "message0": "threadName",
        "colour": 360,
        //"inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const code = '${threadName}';
        return [code, 0];
    }
}
