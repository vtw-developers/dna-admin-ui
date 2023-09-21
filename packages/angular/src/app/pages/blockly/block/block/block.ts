// @ts-ignore
import Blockly from "blockly";

export abstract class BlockConfiguration {

    abstract get category();
    abstract get name();
    abstract get json();
    abstract expression(block, generator);

  // eslint-disable-next-line @typescript-eslint/member-ordering
    init() {
        const that = this;
        Blockly.Blocks[this.name] = {
            init: function () {
                this.jsonInit(that.json);
            }
        };
    }

  // eslint-disable-next-line @typescript-eslint/member-ordering
    addExpression(generator) {
        generator[this.name] = (block) => this.expression(block, generator);
    }

}
