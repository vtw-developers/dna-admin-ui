import {Component, Directive, EventEmitter, Input, Output,} from '@angular/core';

@Directive()
export abstract class AbstractNewFormComponent {

  @Input() save: EventEmitter<any>;

  submit(e) {
    this.save.emit();
  }
}
