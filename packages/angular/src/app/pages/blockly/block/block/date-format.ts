import {BlockConfiguration} from "./block";

export class DateFormatBlock extends BlockConfiguration {

    category = 'Date';
    name = "dateFormat";
    json = {
        "message0": "dateFormat: %1, %2",
        "args0": [
            {"type": "input_value", "name": "DATE"},
            {"type": "input_value", "name": "DATE FORMAT"},
        ],
        "colour": 270,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const date = generator.valueToCode(block, 'DATE', 0);
        const dateFormat = generator.valueToCode(block, 'DATE FORMAT', 0);block
        console.log(dateFormat);
        const code = '${bean:Date?method=changeDateFormat(' + date + ',' + dateFormat + ')}';
        return [code, 0];
    }
}
