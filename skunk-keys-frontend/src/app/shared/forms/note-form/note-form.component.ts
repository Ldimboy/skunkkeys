import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../../../models/note.model';
import { Folder } from '../../../models/folder.model';

@Component({
  selector: 'app-note-form',
  standalone: false,
  templateUrl: './note-form.component.html',
  styleUrls: ['../../styles/form-layout.css']
})

export class NoteFormComponent {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() formNote: Partial<Note> = { title: '', content: '', folder_id: null };
  @Input() folders: Folder[] = [];

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onSave(): void {
    if (this.mode !== 'view') this.save.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}