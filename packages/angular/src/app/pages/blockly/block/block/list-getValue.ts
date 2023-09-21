import {BlockConfiguration} from "./block";

export class ListGetValueBlock extends BlockConfiguration {
    category = 'List';
    name = "listGetValue";
    json = {
        "message0": "get List value %1 %2",
        "args0": [
            {"type": "input_value", "name": "LIST"},
            {"type": "field_input", "name": "INDEX"},
        ],
        "colour": 60,
        "output": "String",
    };

    expression(block, generator) {
        const list = generator.valueToCode(block, 'LIST', 0);
        const index = block.getFieldValue("INDEX");
        const code = '${bean:List?method=getListValue(\'' + list + '\',' + index + ')}';
        return [code, 0];
    }
}
