import {BlockConfiguration} from "./block";

export class DateTimeOffsetBlock extends BlockConfiguration {

    category = 'Date';
    name = "dateTimeOffset";
    json = {
        "message0": "dateTimeOffset: %1, %2, %3",
        "args0": [
            {"type": "input_value", "name": "DATE", "inputsInline": true},
            {"type": "field_input", "name": "DATE TIME OFFSET"},
            {
                "type": "field_dropdown",
                "name": "DATE TYPE",
                "inputsInline": true,
                "options": [["y", "y"],
                            ["M", "M"],
                            ["d", "d"],
                            ["h", "h"],
                            ["m", "m"],
                            ["s", "s"]]
            }
        ],
        "colour": 270,
        // "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const date = generator.valueToCode(block, 'DATE', 0);
        const dateOffset = block.getFieldValue("DATE TIME OFFSET");
        const dateType = block.getFieldValue("DATE TYPE");
        const code = '${bean:Date?method=changeDateTimeOffset(' + date + ',' + dateOffset + ',' + dateType + ')}';

        return [code, 0];
    }
}
