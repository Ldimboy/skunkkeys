import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Folder } from '../../../models/folder.model';
import { Password } from '../../../models/password.model';

@Component({
  selector: 'app-password-form',
  standalone: false,
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.css'
})
export class PasswordFormComponent {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() formPassword: Partial<Password> = {
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    folder_id: null
  };
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
