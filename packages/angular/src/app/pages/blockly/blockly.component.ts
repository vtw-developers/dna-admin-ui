import {AfterViewInit, Component, ElementRef, NgModule, NO_ERRORS_SCHEMA, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {CommonModule} from "@angular/common";

// @ts-ignore
import Blockly from 'blockly';
import {javascriptGenerator} from 'blockly/javascript';
import {ScrollOptions, ScrollBlockDragger, ScrollMetricsManager} from '@blockly/plugin-scroll-options';

@Component({
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss']
})
export class BlocklyComponent implements AfterViewInit {
  workspace: any;
  plugin: any;
  code: string;
  @ViewChild('toolbox') toolbox: ElementRef;

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
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [],
  exports: [],
  declarations: [BlocklyComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BlocklyModule {
}
