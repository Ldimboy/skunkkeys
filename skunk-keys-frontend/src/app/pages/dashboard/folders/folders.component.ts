import { Component, OnInit } from '@angular/core';
import { FolderService } from '../../../services/folder.service';
import { Folder } from '../../../models/folder.model';

@Component({
  selector: 'app-folders',
  standalone: false,
  templateUrl: './folders.component.html',
  styleUrls: ['../../../shared/styles/section-layout.css']
})
export class FoldersComponent implements OnInit {
  folders: Folder[] = [];
  loading = true;

  mode: 'create' | 'edit' | 'view' = 'create';
  formFolder: Partial<Folder> = { title: '' };
  currentFolder: Folder | null = null;

  constructor(private folderService: FolderService) { }

  ngOnInit(): void {
    this.loadFolders();
  }

  loadFolders(): void {
    this.folderService.getFolders().subscribe({
      next: (res) => {
        this.folders = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar carpetas:', err);
        this.loading = false;
      }
    });
  }

  saveFolder(): void {
    if (!this.formFolder.title?.trim()) return;

    if (this.mode === 'edit' && this.currentFolder) {
      this.folderService.updateFolder(this.currentFolder.id, this.formFolder).subscribe({
        next: updated => {
          const idx = this.folders.findIndex(f => f.id === updated.id);
          if (idx > -1) this.folders[idx] = updated;
          this.resetForm();
        },
        error: err => console.error('Error al actualizar carpeta:', err)
      });
    } else {
      this.folderService.createFolder(this.formFolder).subscribe({
        next: created => {
          this.folders.push(created);
          this.resetForm();
        },
        error: err => console.error('Error al crear carpeta:', err)
      });
    }
  }

  deleteFolder(id: number): void {
    const confirmDelete = confirm('¿Eliminar esta carpeta? Las notas o contraseñas seguirán existiendo.');
    if (!confirmDelete) return;

    this.folderService.deleteFolder(id).subscribe({
      next: () => {
        this.folders = this.folders.filter(f => f.id !== id);
        if (this.currentFolder?.id === id) this.resetForm();
      },
      error: err => console.error('Error al eliminar carpeta:', err)
    });
  }

  viewFolder(folder: Folder): void {
    this.mode = 'view';
    this.currentFolder = folder;
    this.formFolder = { ...folder };
  }

  editFolder(folder: Folder): void {
    this.mode = 'edit';
    this.currentFolder = folder;
    this.formFolder = { ...folder };
  }

  resetForm(): void {
    this.mode = 'create';
    this.formFolder = { title: '' };
    this.currentFolder = null;
  }

  getRandomGray(id: number): string {
    const grays = [
      '#111111', '#222222', '#333333', '#444444',
      '#555555', '#666666', '#777777', '#888888',
      '#999999', '#AAAAAA', '#BBBBBB', '#CCCCCC',
      '#DDDDDD', '#EEEEEE'
    ];
    return grays[id % grays.length];
  }
}
