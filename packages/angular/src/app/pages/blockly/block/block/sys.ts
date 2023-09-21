import {BlockConfiguration} from "./block";

export class SysBlock extends BlockConfiguration {
    category = 'System';
    name = "sys";
    json = {
        "message0": "JVM Property %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["java version", "java.version"],
                    ["java vendor", "java.vendor"],
                    ["java home", "java.home"],
                    ["user name", "user.name"],
                    ["user home", "user.home"],
                    ["user dir", "user.dir"],
                    ["os name", "os.name"],
                    ["os version", "os.version"],
                ]
            }
        ],
        "colour": 360,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const op = block.getFieldValue("OP");
        const code = '${sys.' + op + '}';
        return [code, 0];
    }
}
