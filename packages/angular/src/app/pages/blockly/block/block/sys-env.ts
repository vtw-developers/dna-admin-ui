import {BlockConfiguration} from "./block";

export class SysEnvBlock extends BlockConfiguration {
    category = 'System';
    name = "sysEnv";
    json = {
        "message0": "Environment Variable %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "OP",
                "inputsInline": true,
                "options": [
                    ["OS", "OS"],
                    ["IntelliJ IDEA", "IntelliJ IDEA"],
                    ["Path", "Path"],
                    ["CLASSPATH", "CLASSPATH"],
                    ["TEMP", "TEMP"],
                    ["JAVA_HOME", "JAVA_HOME"],
                    ["USERNAME", "USERNAME"],
                ]
            }
        ],
        "colour": 360,
        "inputsInline": true,
        "output": "String",
    };

    expression(block, generator) {
        const op = block.getFieldValue("OP");
        const code = '${env.' + op + '}';
        return [code, 0];
    }
}
