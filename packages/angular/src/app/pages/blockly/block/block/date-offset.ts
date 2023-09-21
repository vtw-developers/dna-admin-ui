import {BlockConfiguration} from "./block";

export class DateOffsetBlock extends BlockConfiguration {

    category = 'Date';
    name = "dateOffset";
    json = {
        "message0": "dateOffset: %1, %2, %3, %4",
        "args0": [
            {"type": "input_value", "name": "DATE", "inputsInline": true},
            {
                "type": "field_dropdown",
                "name": "DATE OPERATION",
                "inputsInline": true,
                "options": [["+", "+"],
                    ["-", "-"]]
            },
            {"type": "input_value", "name": "DATE OFFSET"},
            {
                "type": "field_dropdown",
                "name": "DATE TYPE",
                "inputsInline": true,
                "options": [["y", "y"],
                            ["M", "M"],
                            ["d", "d"],
                            ["h", "h"],
                            ["m", "m"],
                            ["s", "s"],]
            }
        ],
        "colour": 270,
        // "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const date = generator.valueToCode(block, 'DATE', 0);
        const operation = block.getFieldValue("DATE OPERATION");
        const dateOffset = generator.valueToCode(block, 'DATE OFFSET', 0);
        const dateType = block.getFieldValue("DATE TYPE");
        const dateOperationOffset = operation.concat(dateOffset);
        const code = '${bean:Date?method=changeDateTimeOffset(' + date + ',' + dateOperationOffset + ',' + dateType + ')}';

        return [code, 0];
    }
}
