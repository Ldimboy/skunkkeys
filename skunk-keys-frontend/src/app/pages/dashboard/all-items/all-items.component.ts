import { Component, OnInit } from '@angular/core';
import { Note } from '../../../models/note.model';
import { Password } from '../../../models/password.model';
import { Folder } from '../../../models/folder.model';
import { NoteService } from '../../../services/note.service';
import { PasswordService } from '../../../services/password.service';
import { FolderService } from '../../../services/folder.service';

@Component({
  selector: 'app-all-items',
  standalone: false,
  templateUrl: './all-items.component.html',
  styleUrls: ['../../../shared/styles/section-layout.css']

})
export class AllItemsComponent implements OnInit {
  folders: Folder[] = [];
  notes: Note[] = [];
  passwords: Password[] = [];
  expandedFolders: Record<number, boolean> = {};
  allExpanded = true;

  selectedType: 'note' | 'password' | null = null;
  selectedItem: Note | Password | null = null;

  constructor(
    private folderService: FolderService,
    private noteService: NoteService,
    private passwordService: PasswordService
  ) { }

  ngOnInit(): void {
    this.loadFolders();
    this.loadNotes();
    this.loadPasswords();
  }

  get selectedNote(): Note | null {
    return this.selectedType === 'note' ? this.selectedItem as Note : null;
  }

  get selectedPassword(): Password | null {
    return this.selectedType === 'password' ? this.selectedItem as Password : null;
  }

  loadFolders(): void {
    this.folderService.getFolders().subscribe({
      next: res => {
        this.folders = res;
        this.expandedFolders[0] = true; // ← Asegura que "Sin carpeta" también esté expandido por defecto
        res.forEach(folder => this.expandedFolders[folder.id] = true);
      }
    });
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: res => this.notes = res
    });
  }

  loadPasswords(): void {
    this.passwordService.getPasswords().subscribe({
      next: res => this.passwords = res
    });
  }

  toggleFolder(folderId: number): void {
    this.expandedFolders[folderId] = !this.expandedFolders[folderId];
  }

  toggleAll(): void {
    this.allExpanded = !this.allExpanded;
    Object.keys(this.expandedFolders).forEach(id => {
      this.expandedFolders[+id] = this.allExpanded;
    });
  }

  getNotesByFolder(folderId: number | null): Note[] {
    return this.notes.filter(n => n.folder_id === folderId);
  }

  getPasswordsByFolder(folderId: number | null): Password[] {
    return this.passwords.filter(p => p.folder_id === folderId);
  }

  viewItem(type: 'note' | 'password', item: Note | Password): void {
    if (type === 'note') {
      this.noteService.getNote(item.id).subscribe({
        next: (fetched) => {
          this.selectedType = 'note';
          this.selectedItem = fetched;
        },
        error: (err) => {
          console.error('Error al obtener la nota:', err);
          throw err; // Permite que el interceptor lo capture
        }
      });
    } else {
      this.passwordService.getPassword(item.id).subscribe({
        next: (fetched) => {
          this.selectedType = 'password';
          this.selectedItem = fetched;
        },
        error: (err) => {
          console.error('Error al obtener la contraseña:', err);
          throw err; // Igual que arriba
        }
      });
    }
  }


  clearSelection(): void {
    this.selectedType = null;
    this.selectedItem = null;
  }

  getRandomColor(id: number): string {
    const grays = [
      '#111111', '#222222', '#333333', '#444444',
      '#555555', '#666666', '#777777', '#888888',
      '#999999', '#AAAAAA', '#BBBBBB', '#CCCCCC',
      '#DDDDDD', '#EEEEEE'
    ];
    return grays[id % grays.length];
  }
}
