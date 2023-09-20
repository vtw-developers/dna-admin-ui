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
  blockJson;
  @ViewChild('toolbox') toolbox: ElementRef;

  constructor(public router: Router, private route: ActivatedRoute, private apollo: Apollo) {
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

    this.getBlock();
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
      this.blockJson = JSON.stringify(json);
    }
  }

  save = (e)=> {
    e.preventDefault();
    this.block.author = JSON.parse(localStorage.getItem('user')).username
    this.block.data = this.code;
    this.block.blockJson = this.blockJson;

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
