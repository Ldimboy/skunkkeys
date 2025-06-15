import { Component, OnInit } from '@angular/core';
import { PasswordService } from '../../../services/password.service';
import { FolderService } from '../../../services/folder.service';
import { Password } from '../../../models/password.model';
import { Folder } from '../../../models/folder.model';

@Component({
  selector: 'app-passwords',
  standalone: false,
  templateUrl: './passwords.component.html',
  styleUrls: ['../../../shared/styles/section-layout.css']
})

export class PasswordsComponent implements OnInit {
  passwords: Password[] = [];
  folders: Folder[] = [];
  loading = true;

  expandedFolders: Record<number, boolean> = {};
  allExpanded = true;

  showForm = false;
  mode: 'create' | 'edit' | 'view' = 'create';
  formPassword: Partial<Password> = {
    title: '', username: '', password: '',
    url: '', notes: '', folder_id: null
  };
  currentPassword: Password | null = null;

  constructor(
    private passwordService: PasswordService,
    private folderService: FolderService
  ) { }

  ngOnInit(): void {
    this.loadFolders();
    this.loadPasswords();
  }

  // Carga todas las carpetas del usuario
  loadFolders(): void {
    this.folderService.getFolders().subscribe({
      next: (res) => {
        this.folders = res;
        res.forEach(folder => this.expandedFolders[folder.id] = true);
        this.expandedFolders[0] = true; // Sin carpeta
      },
      error: (err) => console.error('Error al cargar carpetas:', err)
    });
  }

  // Carga todas las contraseñas del usuario
  loadPasswords(): void {
    this.passwordService.getPasswords().subscribe({
      next: (res) => {
        this.passwords = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar contraseñas:', err);
        this.loading = false;
      }
    });
  }

  // Filtra las contraseñas por ID de carpeta
  getPasswordsByFolder(folderId: number | null): Password[] {
    return this.passwords.filter(p => p.folder_id === folderId);
  }

  // Alterna el estado expandido/colapsado de una carpeta
  toggleFolder(folderId: number): void {
    this.expandedFolders[folderId] = !this.expandedFolders[folderId];
  }

  // Expande o colapsa todas las carpetas
  toggleAll(): void {
    this.allExpanded = !this.allExpanded;
    Object.keys(this.expandedFolders).forEach(id => {
      this.expandedFolders[+id] = this.allExpanded;
    });
  }

  // Asigna color gris en base al ID
  getRandomGray(id: number): string {
    const grays = ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999'];
    return grays[id % grays.length];
  }

  // Muestra el formulario para crear nueva contraseña
  showPasswordForm(): void {
    this.mode = 'create';
    this.showForm = true;
  }

  // Guarda o actualiza una contraseña
  savePassword(): void {
    if (!this.formPassword.password?.trim()) return;

    if (this.mode === 'edit' && this.currentPassword) {
      this.passwordService.updatePassword(this.currentPassword.id, this.formPassword).subscribe({
        next: (updated) => {
          const idx = this.passwords.findIndex(p => p.id === updated.id);
          if (idx > -1) this.passwords[idx] = updated;
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar contraseña:', err)
      });
    } else {
      this.passwordService.createPassword(this.formPassword).subscribe({
        next: (created) => {
          this.passwords.push(created);
          this.resetForm();
        },
        error: (err) => console.error('Error al crear contraseña:', err)
      });
    }
  }

  // Elimina una contraseña
  deletePassword(passwordId: number): void {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta contraseña?');
    if (!confirmDelete) return;

    this.passwordService.deletePassword(passwordId).subscribe({
      next: () => {
        this.passwords = this.passwords.filter(p => p.id !== passwordId);
        if (this.currentPassword?.id === passwordId) this.resetForm();
      },
      error: (err) => {
        console.error('Error al eliminar contraseña:', err);
        throw err;
      }
    });
  }

  // Visualiza una contraseña (modo solo lectura)
  viewPassword(password: Password): void {
    this.passwordService.getPassword(password.id).subscribe({
      next: (fetched) => {
        this.currentPassword = fetched;
        this.formPassword = { ...fetched };
        this.mode = 'view';
        this.showForm = true;
      },
      error: (err) => {
        console.error('Error al ver contraseña:', err);
        throw err;
      }
    });
  }

  // Prepara el formulario para editar una contraseña
  editPassword(password: Password): void {
    this.mode = 'edit';
    this.currentPassword = password;
    this.formPassword = { ...password };
    this.showForm = true;
  }

  // Reinicia el formulario y oculta
  resetForm(): void {
    this.mode = 'create';
    this.formPassword = {
      title: '', username: '', password: '',
      url: '', notes: '', folder_id: null
    };
    this.currentPassword = null;
    this.showForm = false;
  }
}
