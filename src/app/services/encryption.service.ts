import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private apiUrl = 'http://127.0.0.1:8000';  // URL до вашого FastAPI бекенду

  constructor(private http: HttpClient) { }

  // Шифрування файлу
  encryptFile(file: File, password: string): Observable<HttpResponse<Blob>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    return this.http.post(`${this.apiUrl}/encrypt-file/`, formData, {
        observe: 'response',  // Вказуємо, що хочемо отримати повну відповідь (разом із заголовками)
        responseType: 'blob'  // Очікуємо відповідь у вигляді файла (Blob)
    });
}

  // Дешифрування файлу
  decryptFile(file: File, password: string): Observable<HttpResponse<Blob>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
  
    return this.http.post(`${this.apiUrl}/decrypt-file/`, formData, {
      observe: 'response',  // Спостерігаємо за повною відповіддю
      responseType: 'blob'  // Вказуємо, що очікуємо відповідь у вигляді файла
    });
  }

  // Шифрування рядка
  encryptString(data: string, password: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('data', data);
    formData.append('password', password);

    return this.http.post(`${this.apiUrl}/encrypt-string/`, formData);
  }

  // Дешифрування рядка
  decryptString(data: string, password: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('data', data);
    formData.append('password', password);

    return this.http.post(`${this.apiUrl}/decrypt-string/`, formData);
  }
}
