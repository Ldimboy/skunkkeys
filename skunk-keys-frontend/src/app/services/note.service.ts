import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note.model';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoteService {
    private apiUrl = 'http://localhost:8000/api/notes';

    constructor(private http: HttpClient) { }

    getNotes(): Observable<Note[]> {
        return this.http.get<{ notes: Note[] }>(this.apiUrl).pipe(
            map(res => res.notes)
        );
    }

    createNote(note: Partial<Note>): Observable<Note> {
        return this.http.post<{ note: Note }>(this.apiUrl, note).pipe(
            map(res => res.note)
        );
    }

    updateNote(id: number, note: Partial<Note>): Observable<Note> {
        return this.http.put<{ note: Note }>(`${this.apiUrl}/${id}`, note).pipe(
            map(res => res.note)
        );
    }

    deleteNote(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
