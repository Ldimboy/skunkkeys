import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../../services/note.service';
import { FolderService } from '../../../services/folder.service';
import { Note } from '../../../models/note.model';
import { Folder } from '../../../models/folder.model';

@Component({
  selector: 'app-notes',
  standalone: false,
  templateUrl: './notes.component.html',
  styleUrls: ['../../../shared/styles/section-layout.css']
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  folders: Folder[] = [];
  loading = true;

  expandedFolders: Record<number, boolean> = {};
  allExpanded: boolean = true;


  showForm: boolean = false;
  mode: 'create' | 'edit' | 'view' = 'create';
  formNote: Partial<Note> = { title: '', content: '', folder_id: null };
  currentNote: Note | null = null;

  constructor(
    private noteService: NoteService,
    private folderService: FolderService
  ) { }

  saveNote(): void {
    if (!this.formNote.title?.trim()) return;

    if (this.mode === 'edit' && this.currentNote) {
      this.noteService.updateNote(this.currentNote.id, this.formNote).subscribe({
        next: updated => {
          const idx = this.notes.findIndex(n => n.id === updated.id);
          if (idx > -1) this.notes[idx] = updated;
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar nota:', err)
      });
    } else {
      this.noteService.createNote(this.formNote).subscribe({
        next: created => {
          this.notes.push(created);
          this.resetForm();
        },
        error: (err) => console.error('Error al crear nota:', err)
      });
    }
  }

  deleteNote(noteId: number): void {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta nota?');
    if (!confirmDelete) return;

    this.noteService.deleteNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(n => n.id !== noteId);
        if (this.currentNote?.id === noteId) this.resetForm();
      },
      error: (err) => {
        console.error('Error al eliminar nota:', err);
        throw err; // permite que el interceptor lo capture por si expira el token JWT
      }
    });
  }


  viewNote(note: Note): void {
    this.noteService.getNote(note.id).subscribe({
      next: (fetched) => {
        this.currentNote = fetched;
        this.formNote = { ...fetched };
        this.mode = 'view';
        this.showForm = true;
      },
      error: (err) => {
        console.error('Error al ver nota:', err);
        throw err; // Esto permitirá al interceptor redirigir si el JWT ha expirado
      }
    });
  }

  editNote(note: Note): void {
    this.mode = 'edit';
    this.currentNote = note;
    this.formNote = { ...note };
    this.showForm = true;
  }

  resetForm(): void {
    this.mode = 'create';
    this.formNote = { title: '', content: '', folder_id: null };
    this.currentNote = null;
    this.showForm = false;
  }

  showNoteForm(): void {
    this.mode = 'create';
    this.showForm = true;
  }


  ngOnInit(): void {
    this.loadFolders();
    this.loadNotes();
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (res) => {
        this.notes = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar notas:', err);
        this.loading = false;
      }
    });
  }

  loadFolders(): void {
    this.folderService.getFolders().subscribe({
      next: (res) => {
        this.folders = res;
        res.forEach(folder => this.expandedFolders[folder.id] = true);
        this.expandedFolders[0] = true;
      },
      error: (err) => {
        console.error('Error al cargar carpetas:', err);
      }
    });
  }

  getNotesByFolder(folderId: number | null): Note[] {
    return this.notes.filter(note => note.folder_id === folderId);
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