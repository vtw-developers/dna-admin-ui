import {BlockConfiguration} from "./block";

export class DateTimeBlock extends BlockConfiguration {
    category = 'Date';
    name = "dateTime";
    json = {
        "message0": "dateTime: %1 %2 : %3 : %4",
        "args0": [
            {"type": "field_date", "name": "DATE"},
            {"type": "field_input", "name": "HOUR","text": "00"},
            {"type": "field_input", "name": "MINUTE","text": "00"},
            {"type": "field_input", "name": "SECOND","text": "00"},
        ],
        "colour": 270,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const date = block.getFieldValue("DATE");
        const hour = block.getFieldValue("HOUR");
        const minute = block.getFieldValue("MINUTE");
        const second = block.getFieldValue("SECOND");

        const dateTime = date + " " + hour + ":" + minute + ":" + second;
        console.log(dateTime);
        const code = '${bean:Date?method=dateTime(' + dateTime + ')}';
        return [code, 0];
    }
}
