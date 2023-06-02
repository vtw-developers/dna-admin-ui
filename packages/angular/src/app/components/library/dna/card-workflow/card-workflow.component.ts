import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  Input,
  SimpleChanges,
  OnInit,
  OnChanges,
  ViewChild,
  Output,
  EventEmitter,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxListModule } from 'devextreme-angular/ui/list';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { CardMenuModule } from '../../card-menu/card-menu.component';
import { Activity } from 'src/app/types/activities';
import {CardActivitiesModule} from '../../card-activities/card-activities.component';
import {
  DxAccordionModule, DxDiagramComponent, DxDiagramModule,
  DxFormModule,
  DxScrollViewModule, DxTextBoxModule,
  DxToolbarModule,
  DxValidationGroupModule, DxValidatorModule
} from 'devextreme-angular';
import {ContactStatusModule} from '../../../utils/contact-status/contact-status.component';
import {DxoColCountByScreenModule} from 'devextreme-angular/ui/nested';
import {FormPhotoModule} from '../../../utils/form-photo/form-photo.component';
import {FormTextboxModule} from '../../../utils/form-textbox/form-textbox.component';
import {formatMessage} from 'devextreme/localization';
import {FlowNodeService} from './flow-node.service';
import ArrayStore from 'devextreme/data/array_store';

@Component({
  selector: 'card-workflow',
  templateUrl: './card-workflow.component.html',
  styleUrls: ['../../../../../../node_modules/devexpress-diagram/dist/dx-diagram.min.css', './card-workflow.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FlowNodeService]
})
export class CardWorkflowComponent implements AfterViewInit {
  @Input() activities: Activity[];

  @Input() showBy? = false;

  @Input() isLoading: boolean = false;

  @ViewChild(DxDiagramComponent, {static: false}) diagram: DxDiagramComponent;
  @Output() dirtyEvent = new EventEmitter<boolean>();
  @Output() nodeChanged = new EventEmitter();
  projectId;
  status;
  openedTabList = [];
  nodeInfos: any[];
  flowDiagram;
  inputParameters;
  nodesDataSource: ArrayStore;
  edgesDataSource: ArrayStore;
  projectItems;
  selectedNode: any;
  onResizedSubscription;
  commands = [
    {
      name: 'Breakpoint', text: formatMessage('Breakpoint'),
      items: [
        {name: 'addBreakpoint', text: formatMessage('Add')},
        {name: 'removeBreakpoint', text: formatMessage('Remove')}
      ]
    }
  ];
  suspendedBreakpointNodeId;
  breakpoints = [];
  formatMessage = formatMessage;
  path;
  navItem;
  flow;

  suspendedBreakpoints = [];
  messageHistories = [];

  activityMenuItems: Array<{ text: string }> = [
    { text: 'View details' },
    { text: 'Delete' },
  ];
    contactData = {
        id: 1,
        system: '대한상공회의소',
        name: '자격취득자 추출',
        template: '변동 테이블 추출',
        source: '자격취득자정보[TB_A001]',
        target: '자격취득인적정보[PERSON]',
        status: 'Error',
        lastRunDate: '2023-05-23 14:13:25',
        recentCount: 2342034
    };

  constructor(private flowNodeService: FlowNodeService) {
    this.nodeInfos = this.flowNodeService.getNodeInfos();
    console.log(this.nodeInfos);

  }

  ngAfterViewInit(): void {
    this.loadDiagram();
  }

  loadDiagram() {
    const that = this;
    // if (!this.openedTabList.find(e => e.flowId === this.flowId)) {
    const result = {
      "data": {
        "flowByPath": {
          "id": "4fec3376-83eb-4ff2-a0c2-4818e251b519",
          "name": "Flow1",
          "diagram": {
            "nodes": [
              {
                "id": "64f2f4c0-3ed2-4a91-bfde-2bd26341fbe7",
                "type": "directConsumer",
                "name": "Flow1",
                "label": "Start",
                "root": true,
                "options": {},
                "position": {
                  "x": 0,
                  "y": 0,
                  "height": 0,
                  "width": 0
                }
              },
              {
                "id": "1dfb0d5d-f19c-4fec-8ad4-db28dc14996b",
                "type": "function",
                "name": "Flow1Function1",
                "label": "Process",
                "root": false,
                "options": {
                  "field": "_result",
                  "expression": "${body}",
                  "language": "Simple",
                  "blockly": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"body\" id=\"P`vw*ESyG^G%YY9r(BA;\" x=\"100\" y=\"100\"></block></xml>"
                },
                "position": {
                  "x": 0,
                  "y": 2,
                  "height": 0,
                  "width": 0
                }
              }
            ],
            "edges": [
              {
                "id": "869579bc-8355-486a-9245-474180d717b3",
                "fromId": "64f2f4c0-3ed2-4a91-bfde-2bd26341fbe7",
                "toId": "1dfb0d5d-f19c-4fec-8ad4-db28dc14996b",
                "text": null
              }
            ]
          },
          "validated": true,
          "inputParameters": [],
          "templateParameters": [],
          "templatedFlows": [],
          "domainModel": null,
          "suspendedBreakpointNodeId": null
        }
      },
      "loading": false,
      "networkStatus": 7
    }

    this.flowDiagram = result.data.flowByPath?.diagram;
    console.log(this.flowDiagram);
    if (!this.flowDiagram) {
      return;
    }
    this.nodesDataSource = new ArrayStore({
      key: 'id',
      data: this.flowDiagram.nodes,
      onInserting(node) {
        if (node.type === 'history') {
          return;
        }
        that.flowNodeService.initNodeOptions(node);
        if (node.type === 'directConsumer' || node.type === 'scheduler') {
          node.name = that.flow.name;
        }
      }
    });
    this.edgesDataSource = new ArrayStore({
      key: 'id',
      data: this.flowDiagram.edges
    });
  }

  onSelectionChanged(e) {
    const selectedItem = e.items.pop();
    if (selectedItem?.itemType === 'shape') {
      this.selectedNode = this.flowDiagram.nodes.find(node => node.id === selectedItem.key);
      this.nodeChanged.emit(this.selectedNode);
    }
  }

}

@NgModule({
  imports: [
    DxListModule,
    DxButtonModule,
    DxLoadPanelModule,
    CardMenuModule,

    CommonModule,
    CardActivitiesModule,
    DxAccordionModule,
    ContactStatusModule,
    DxFormModule,
    DxScrollViewModule,
    DxToolbarModule,
    DxValidationGroupModule,
    DxoColCountByScreenModule,
    FormPhotoModule,
    FormTextboxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxDiagramModule,
  ],
  declarations: [CardWorkflowComponent],
  exports: [CardWorkflowComponent],
})
export class CardWorkflowModule { }
