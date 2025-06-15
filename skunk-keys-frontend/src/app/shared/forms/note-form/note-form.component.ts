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

  // Emite el evento de guardar
  onSave(): void {
    if (this.mode !== 'view') this.save.emit();
  }

  // Emite el evento de cancelar
  onCancel(): void {
    this.cancel.emit();
  }

  // Solo permite guardar si hay título y contenido no vacíos
  canSave(): boolean {
    return !!this.formNote.title?.trim() && !!this.formNote.content?.trim();
  }
}