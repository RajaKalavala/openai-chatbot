import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'client';
    Chats: Chat[] = [];
    url = 'http://localhost:5001';

    chatForm = new FormGroup({
        userChat: new FormControl(''),
    });

    constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

    ngOnInit(): void {}

    onSubmit() {
        let chat = this.chatForm.value.userChat;
        if (chat) {
            this.Chats.push(new Chat(chat, false));
            this.getResponse(chat);
            this.chatForm.reset();
        }

        console.log('submit clicked - ' + this.chatForm.value.userChat);
    }

    getResponse(prompt: string) {
        this.http
            .post(
                this.url,
                JSON.stringify({
                    prompt: prompt,
                }),
                {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                    }),
                }
            )
            .subscribe({
                next: (res: any) => {
                    this.Chats.push(new Chat(res.bot, true));
                    console.log('Response - ' + res.bot);
                },
                error: (err) => {
                    console.log('Error - ' + err.message);
                },
            });
    }
}

class Chat {
    constructor(message: string, isBot: boolean) {
        this.message = message;
        this.isBot = isBot;
    }
    message: string;
    isBot: boolean;
}
