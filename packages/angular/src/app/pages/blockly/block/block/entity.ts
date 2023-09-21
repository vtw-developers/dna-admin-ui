import {BlockConfiguration} from "./block";

export class EntityBlock extends BlockConfiguration {

    category = 'Variables';
    name = "entity";
    json = {
        "type": "entity",
        "message0": "Entity Name: %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ENTITY NAME",
                "inputsInline": true,
                "options": [["", ""]]
            }
        ],
        "colour": 90,
        "output": "String",
    };

    expression(block, generator) {
        const entityName = block.getFieldValue("ENTITY NAME");
        console.log(entityName);
        let code = '';
        code = '{bean:' + entityName + '}';
        return [code, 0];
    }
}
