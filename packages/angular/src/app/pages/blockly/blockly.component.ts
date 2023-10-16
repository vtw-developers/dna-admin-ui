import {AfterViewInit, Component, ElementRef, NgModule, NO_ERRORS_SCHEMA, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {CommonModule} from "@angular/common";

// @ts-ignore
import Blockly from 'blockly';
import {Block} from './blockly.service';
import {javascriptGenerator} from 'blockly/javascript';
import {DxButtonModule, DxDateBoxModule, DxSelectBoxModule, DxTextAreaModule, DxTextBoxModule, DxValidatorModule} from "devextreme-angular";
import {Apollo, gql} from "apollo-angular";
import notify from "devextreme/ui/notify";
import {DxiValidationRuleModule} from "devextreme-angular/ui/nested";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss']
})
export class BlocklyComponent implements AfterViewInit {
  workspace: any;
  plugin: any;
  code: string;
  block: Block = {} as any;
  finished;
  id;
  @ViewChild('toolbox') toolbox: ElementRef;

  constructor(public router: Router, private route: ActivatedRoute, private apollo: Apollo) {
  }

  ngAfterViewInit(): void {
    this.workspace = Blockly.inject('blocklyDiv',
      {
        toolbox: this.initToolbox(),
        move: {
          scrollbars: {
            "horizontal": true,
            "vertical": true,
          },
        },
      });
    this.getBlock();
    this.block.author = JSON.parse(localStorage.getItem('user')).username;
  }

  getBlock() {
    if (this.route.snapshot.paramMap.get('state') != 'null') {
      this.id = this.route.snapshot.paramMap.get('state');
      this.apollo.query({
        query: gql`
          query blockly($id: ID) {
            blockly(id: $id) {
              id
              author
              registerDate
              blockJson
              data
              dataName
              dataDetail
              pythonData
              comment
              finished
              finishDate
            }
          }
        `,
        variables: {
          id: this.id
        }
      }).subscribe({
        next: (result: any) => {
          this.block = result.data.blockly;
          this.code = this.block.data
          if (this.block.finished == true){
            this.finished = "완료";
          } else if (this.block.finished == false){
            this.finished = "미완료";
          }

          // @ts-ignore
          const json = JSON.parse(this.block.blockJson);
          Blockly.serialization.workspaces.load(json, this.workspace);
        },
        error: (e) => {
          console.error(e);
          notify('블록 정보를 불러오는데 오류가 발생하였습니다.', 'error', 3000);
        }
      });
    }
  }

  keyDownEvent(e) {
    if (e.ctrlKey && e.key === 's' || e.ctrlKey && e.key === 'S') {
      e.preventDefault();
      this.code = javascriptGenerator.workspaceToCode(this.workspace);
      const json = Blockly.serialization.workspaces.save(this.workspace);
      this.block.blockJson = JSON.stringify(json);
    }
  }

  save = (e)=> {
    e.preventDefault();
    this.block.data = this.code;

    if(this.finished == "완료"){
      this.block.finished = true;
    } else if (this.finished == "미완료") {
      this.block.finished = false;
    }

    this.apollo.mutate({
      mutation: gql`
        mutation createBlockly($blockly: BlocklyInput) {
          createBlockly(blockly: $blockly) {
            id
          }
        }
      `,
      variables: {
        blockly: this.block
      }
    }).subscribe({
      next: (result: any) => {
        notify('블록이 저장되었습니다.', 'success', 3000);
      },
      error: (e) => {
        console.error(e);
        notify('블록 저장에 실패하였습니다.', 'error', 3000);
      }
    });
    this.router.navigate(['/blockly-list']);
  }

  initToolbox(): any {
    let categoryToolbox = {
      contents: undefined,
      kind: undefined
    };
    categoryToolbox = {
      kind: "categoryToolbox",
      contents: [
        {
          "kind": "category",
          "name": "Logic",
          "colour": 210,
          "contents": [
            {
              "kind": "block",
              "type": "controls_if"
            },
            {
              "kind": "block",
              "type": "logic_compare",
            },
            {
              "kind": "block",
              "type": "logic_operation"
            },
            {
              "kind": "block",
              "type": "logic_negate",
            },
            {
              "kind": "block",
              "type": "logic_boolean"
            },
            {
              "kind": "block",
              "type": "logic_null",
            },
            {
              "kind": "block",
              "type": "logic_ternary"
            },
          ]
        },
        {
          "kind": "category",
          "name": "Loops",
          "colour": 90,
          "contents": [
            {
              "kind": "block",
              "type": "controls_repeat_ext"
            },
            {
              "kind": "block",
              "type": "controls_repeat",
            },
            {
              "kind": "BLOCK",
              "type": "controls_whileUntil"
            },
            {
              "kind": "BLOCK",
              "type": "controls_for"
            },
            {
              "kind": "BLOCK",
              "type": "controls_forEach"
            },
            {
              "kind": "BLOCK",
              "type": "controls_flow_statements"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Math",
          "colour": 230,
          "contents": [
            {
              "kind": "BLOCK",
              "type": "math_number",
              "gap": "32"
            },
            {
              "kind": "BLOCK",
              "type": "math_arithmetic"
            },
            {
              "kind": "BLOCK",
              "type": "math_single"
            },
            {
              "kind": "BLOCK",
              "type": "math_trig"
            },
            {
              "kind": "BLOCK",
              "type": "math_constant"
            },
            {
              "kind": "BLOCK",
              "type": "math_number_property"
            },
            {
              "kind": "BLOCK",
              "type": "math_round"
            },
            {
              "kind": "BLOCK",
              "type": "math_on_list"
            },
            {
              "kind": "BLOCK",
              "type": "math_modulo"
            },
            {
              "kind": "BLOCK",
              "type": "math_constrain"
            },
            {
              "kind": "BLOCK",
              "type": "math_random_int"
            },
            {
              "kind": "BLOCK",
              "type": "math_random_float"
            },
            {
              "kind": "BLOCK",
              "type": "math_atan2"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Text",
          "colour": 150,
          "contents": [
            {
              "kind": "BLOCK",
              "type": "text"
            },
            {
              "kind": "BLOCK",
              "type": "text_multiline"
            },
            {
              "kind": "BLOCK",
              "type": "text_join"
            },
            {
              "kind": "BLOCK",
              "type": "text_append"
            },
            {
              "kind": "BLOCK",
              "type": "text_length"
            },
            {
              "kind": "BLOCK",
              "type": "text_isEmpty"
            },
            {
              "kind": "BLOCK",
              "type": "text_indexOf"
            },
            {
              "kind": "BLOCK",
              "type": "text_charAt"
            },
            {
              "kind": "BLOCK",
              "type": "text_getSubstring"
            },
            {
              "kind": "BLOCK",
              "type": "text_changeCase"
            },
            {
              "kind": "BLOCK",
              "type": "text_trim"
            },
            {
              "kind": "BLOCK",
              "type": "text_count"
            },
            {
              "kind": "BLOCK",
              "type": "text_replace"
            },
            {
              "kind": "BLOCK",
              "type": "text_reverse"
            },
            {
              "kind": "BLOCK",
              "type": "text_print"
            },
            {
              "kind": "BLOCK",
              "type": "text_prompt_ext"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Lists",
          "colour": 250,
          "contents": [
            {
              "kind": "BLOCK",
              "type": "lists_create_with"
            },
            {
              "kind": "BLOCK",
              "type": "lists_create_with"
            },
            {
              "kind": "BLOCK",
              "type": "lists_repeat"
            },
            {
              "kind": "BLOCK",
              "type": "lists_length"
            },
            {
              "kind": "BLOCK",
              "type": "lists_isEmpty"
            },
            {
              "kind": "BLOCK",
              "type": "lists_indexOf"
            },
            {
              "kind": "BLOCK",
              "type": "lists_getIndex"
            },
            {
              "kind": "BLOCK",
              "type": "lists_setIndex"
            },
            {
              "kind": "BLOCK",
              "type": "lists_getSublist"
            },
            {
              "kind": "BLOCK",
              "type": "lists_split"
            },
            {
              "kind": "BLOCK",
              "type": "lists_sort"
            },
            {
              "kind": "BLOCK",
              "type": "lists_reverse"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Colour",
          "colour": 30,
          "contents": [
            {
              "kind": "BLOCK",
              "type": "colour_picker"
            },
            {
              "kind": "BLOCK",
              "type": "colour_random"
            },
            {
              "kind": "BLOCK",
              "type": "colour_rgb"
            },
            {
              "kind": "BLOCK",
              "type": "colour_blend"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Variables",
          "colour": 330,
          "custom": "VARIABLE"
        },
        {
          "kind": "category",
          "name": "Functions",
          "colour": 280,
          "custom": "PROCEDURE"
        }
      ]
    }
    return categoryToolbox;
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxiValidationRuleModule,
    DxTextAreaModule,
    DxDateBoxModule,
  ],
  providers: [],
  exports: [],
  declarations: [BlocklyComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BlocklyModule {
}
