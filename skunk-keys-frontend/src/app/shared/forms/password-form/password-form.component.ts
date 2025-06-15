import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Folder } from '../../../models/folder.model';
import { Password } from '../../../models/password.model';

@Component({
  selector: 'app-password-form',
  standalone: false,
  templateUrl: './password-form.component.html',
  styleUrls: ['../../styles/form-layout.css']
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

  // Valida que los campos obligatorios estén rellenos
  isValid(): boolean {
    return !!this.formPassword.title?.trim() &&
           !!this.formPassword.username?.trim() &&
           !!this.formPassword.password?.trim();
  }

  // Emite el evento de guardar si no está en modo vista
  onSave(): void {
    if (this.mode !== 'view') this.save.emit();
  }

  // Emite el evento de cancelar
  onCancel(): void {
    this.cancel.emit();
  }
}
