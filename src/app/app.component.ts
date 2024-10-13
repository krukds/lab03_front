import { Component } from '@angular/core';
import { EncryptionService } from './services/encryption.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "./header/header.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, HeaderComponent, HttpClientModule], 
  providers: [EncryptionService]
})
export class AppComponent {
  title = 'lab03_front';

  fileToEncrypt: File | null = null;
  fileToDecrypt: File | null = null;
  password = '';
  inputString = '';      // Додали для вводу рядка
  encryptedString = '';
  decryptedString = '';

  constructor(private encryptionService: EncryptionService) { }

  // Обробка вибору файлу для шифрування
  onEncryptFileSelected(event: any) {
    this.fileToEncrypt = event.target.files[0];
  }

  // Обробка вибору файлу для дешифрування
  onDecryptFileSelected(event: any) {
    this.fileToDecrypt = event.target.files[0];
  }

// Метод обробки кліку для шифрування
onEncryptFileClicked() {
  if (this.fileToEncrypt && this.password) {
      this.encryptionService.encryptFile(this.fileToEncrypt, this.password).subscribe((response) => {
          // Перевірка заголовка Content-Disposition
          const contentDisposition = response.headers.get('content-disposition');
          console.log("response: ", response);
          console.log("contentDisposition: ", contentDisposition);
          let filename = 'encrypted_file.enc'; // Значення за замовчуванням

          if (contentDisposition) {
              const matches = /filename="?(.+)"?/.exec(contentDisposition);
              if (matches != null && matches[1]) {
                  filename = matches[1]; // Використовуємо ім'я з заголовка
              }
          }

          // Перевірка тіла відповіді
          if (response.body) { // Переконайтесь, що не null
              const blob = new Blob([response.body], { type: 'application/octet-stream' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;  // Використовуємо ім'я з заголовка
              a.click();
          } else {
              console.error("Отримано порожній файл.");
          }
      }, error => {
          console.error("Помилка при шифруванні файлу:", error);
      });
  } else {
      console.log("Файл або пароль не вказані.");
  }
}

onDecryptFileClicked() {
  if (this.fileToDecrypt && this.password) {
    this.encryptionService.decryptFile(this.fileToDecrypt, this.password).subscribe((response) => {
      // Перевірка заголовка Content-Disposition
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'decrypted_file'; // Значення за замовчуванням

      // Отримання імені файлу з заголовка Content-Disposition
      if (contentDisposition) {
        const matches = /filename="?(.+)"?/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1]; // Використовуємо ім'я з заголовка
        }
      }

      // Перевіряємо, чи не null
      if (response.body) {
        const blob = new Blob([response.body], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // Використовуємо ім'я з заголовка
        a.click();
      } else {
        console.error("Отримано порожній файл.");
      }
    }, error => {
      console.error("Помилка при дешифруванні файлу:", error);
    });
  } else {
    console.log("Файл або пароль не вказані.");
  }
}


  onEncryptStringClicked() {
    if (this.inputString && this.password) {
      this.encryptionService.encryptString(this.inputString, this.password).subscribe((response) => {
        this.encryptedString = response.encrypted_string;
      });
    } else {
      console.log("Рядок або пароль не вказані.");
    }
  }

  onDecryptStringClicked() {
    if (this.encryptedString && this.password) {
      this.encryptionService.decryptString(this.encryptedString, this.password).subscribe((response) => {
        this.decryptedString = response.decrypted_string;
      });
    } else {
      console.log("Зашифрований рядок або пароль не вказані.");
    }
  }
}
