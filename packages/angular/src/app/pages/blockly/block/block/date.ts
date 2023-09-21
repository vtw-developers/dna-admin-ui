import {BlockConfiguration} from "./block";

export class DateBlock extends BlockConfiguration {

    category = 'Date';
    name = "date";
    json = {
        "message0": "date: %1",
        "args0": [
            {"type": "field_date", "name": "DATE"},
        ],
        "colour": 270,
        // "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const date = block.getFieldValue("DATE");
        const code = date;
        return [code, 0];
    }
}
