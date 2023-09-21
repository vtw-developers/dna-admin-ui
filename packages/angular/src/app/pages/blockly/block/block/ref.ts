import {BlockConfiguration} from "./block";

export class RefBlock extends BlockConfiguration {
    category = 'System';
    name = "ref";
    json = {
        "message0": "ref: %1",
        "args0": [
            {"type": "field_input", "name": "BEAN"}
        ],
        "colour": 360,
        // "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const bean = block.getFieldValue("BEAN");
        const code = '${ref:' + bean + '}';
        return [code, 0];
    }
}
