import {BlockConfiguration} from "./block";

export class NowDateBlock extends BlockConfiguration {

    category = 'Date';
    name = "nowDate";
    json = {
        "type": "nowDate",
        "message0": "nowDate",
        "colour": 270,
        "output": "String",
    };

    expression(block, generator) {
        const date = block.getFieldValue("DATE");
        const code = "${bean:Date?method=nowDate()}";
        return [code, 0];
    }
}
