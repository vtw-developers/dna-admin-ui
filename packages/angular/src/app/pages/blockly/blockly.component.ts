import {AfterViewInit, Component, ElementRef, NgModule, NO_ERRORS_SCHEMA, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {CommonModule} from "@angular/common";

// @ts-ignore
import Blockly from 'blockly';
import {Block} from './blockly.service';
import {javascriptGenerator} from 'blockly/javascript';
import {ScrollOptions, ScrollBlockDragger, ScrollMetricsManager} from '@blockly/plugin-scroll-options';
import {DxButtonModule, DxSelectBoxModule, DxTextBoxModule, DxValidatorModule} from "devextreme-angular";
import {Apollo, gql} from "apollo-angular";
import notify from "devextreme/ui/notify";
import {DxiValidationRuleModule} from "devextreme-angular/ui/nested";

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
  @ViewChild('toolbox') toolbox: ElementRef;

  constructor(private apollo: Apollo) {
  }

  ngAfterViewInit(): void {
    this.workspace = Blockly.inject('blocklyDiv',
      {
        toolbox: this.toolbox.nativeElement,

        // 스크롤 작동안함
        plugins: {
          'blockDragger': ScrollBlockDragger,
          'metricsManager': ScrollMetricsManager,
        },
        move: {
          wheel: true,
        },
      });

    this.plugin = new ScrollOptions(this.workspace);
    this.plugin.init();

    this.code = javascriptGenerator.workspaceToCode(this.workspace);
  }

  keyDownEvent(e) {
    if (e.ctrlKey && e.key === 's' || e.ctrlKey && e.key === 'S') {
      e.preventDefault();
      this.code = javascriptGenerator.workspaceToCode(this.workspace);

      // const json = Blockly.serialization.workspaces.save(this.workspace);
      // console.log(json);
    }
  }

  save = (e)=> {
    e.preventDefault();
    this.block.author = JSON.parse(localStorage.getItem('user')).username
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
  ],
  providers: [],
  exports: [],
  declarations: [BlocklyComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BlocklyModule {
}
