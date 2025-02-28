import {Component, NgModule, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {CommonModule} from "@angular/common";
import {DxButtonModule, DxDataGridComponent, DxDataGridModule} from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import {PageableService} from "../../services/pageable.service";
import {Apollo, gql} from "apollo-angular";
import {Router} from "@angular/router";
import CustomStore from "devextreme/data/custom_store";
import {firstValueFrom} from "rxjs";
import notify from "devextreme/ui/notify";
import {confirm} from "devextreme/ui/dialog";

@Component({
  templateUrl: './blockly-list.component.html',
  providers: [PageableService],
})
export class BlocklyListComponent{

  blocklyList: DataSource;
  filter: any;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;

  constructor(private pageableService: PageableService, private apollo: Apollo, private router: Router) {
    this.searchBlock();
  }

  searchBlock() {
    this.blocklyList = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          this.grid.instance.clearSelection();

          const pageable = this.pageableService.getPageable(loadOptions);
          pageable.filter = this.filter;

          const page$ = this.apollo.query({
            query: gql`
              query blocklyList(
                $page: Int = 0,
                $size: Int = 10,
                $sortBy: String = "id",
                $sortDir: String = "asc",
                $filter: String = "") {
                blocklyList(page: $page, size: $size, sortBy: $sortBy, sortDir: $sortDir, filter: $filter) {
                  totalElements
                  content {
                    id
                    dataName
                    users {
                      userId
                      name
                    }
                    registerDate
                    finishDate
                  }
                }
              }
            `,
            variables: {
              page: pageable.page,
              size: pageable.size,
              sortBy: pageable.sortBy,
              sortDir: pageable.sortDir,
              filter: pageable.filter
            }
          });

          return firstValueFrom(page$)
            .then((page: any) => {
              return this.pageableService.transformPage(page.data.blocklyList);
            });
        },
      })
    });
  }

  create(){
    const selectedBlock = null;
    this.router.navigate(['/blockly', {state: selectedBlock}]);
  }

  delete = (e) => {
    const result = confirm('<i>블록을 삭제하시겠습니까?</i>', '삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.apollo.mutate({
          mutation: gql`
            mutation deleteBlockly($id: ID) {
              deleteBlockly(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: e.row.data.id
          }
        }).subscribe({
          next: (result: any) => {
            notify('블록이 삭제되었습니다.', 'success', 3000);
            this.refresh();
          },
          error: (e) => {
            console.error(e);
            notify('블록 삭제에 실패하였습니다.', 'error', 3000);
          }
        });
      }
    });
  }

  update = (e) => {
    const selectedBlock = e.row.data.id;
    this.router.navigate(['/blockly', {state: selectedBlock}]);
  }

  refresh(){
    this.searchBlock();
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
  ],
  providers: [],
  exports: [],
  declarations: [BlocklyListComponent]
})
export class BlocklyListModule {
}
