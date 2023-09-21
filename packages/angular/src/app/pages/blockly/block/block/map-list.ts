import {BlockConfiguration} from "./block";

export class MapListBlock extends BlockConfiguration {

    category = 'Map';
    name = "mapList";
    json = {
        "message0": "%{BKY_LISTS_CREATE_EMPTY_TITLE} %1",
        "args0": [
            {
                "type": "input_dummy",
                "name": "EMPTY",
            },
        ],
        "colour": 180,
        "mutator": "new_list_create_with_mutator",
        "output": "Array"
    };

    override expression(block, generator) {

        //const value = generator.valueToCode(block, 'EMPTY', 0);
        let result = '{';
        let inputLength = 0;
        const inputList = block.inputList;
        console.log(inputList);
        inputList.forEach(input => {
            const inputName = input.name;
            const inputCode = generator.valueToCode(block, inputName, 0);
            inputLength += 1;
            result = (inputLength < inputList.length) ? result += inputCode+"," : result += inputCode;
        })
        result += '}';
        console.log(result);
        result = result.replace(/{/gi, "▷");
        result = result.replace(/}/gi, "◁");
        const code = '${bean:Map?method=createMap(\''+result+'\')}';
        return [code, 0];
    }
}
