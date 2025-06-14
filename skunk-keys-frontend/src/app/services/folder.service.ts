import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Folder } from '../models/folder.model';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FolderService {
    private apiUrl = 'http://localhost:8000/api/folders';

    constructor(private http: HttpClient) { }

    getFolders(): Observable<Folder[]> {
        return this.http.get<{ folders: Folder[] }>(this.apiUrl).pipe(
            map(res => res.folders)
        );
    }

    createFolder(folder: Partial<Folder>): Observable<Folder> {
        return this.http.post<{ folder: Folder }>(this.apiUrl, folder).pipe(
            map(res => res.folder)
        );
    }

    updateFolder(id: number, folder: Partial<Folder>): Observable<Folder> {
        return this.http.put<{ folder: Folder }>(`${this.apiUrl}/${id}`, folder).pipe(
            map(res => res.folder)
        );
    }

    deleteFolder(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
