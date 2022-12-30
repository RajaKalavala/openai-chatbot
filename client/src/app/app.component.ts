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
    url = 'https://openai-chatbot-c9ry.onrender.com';
    loadInterval: any;
    uniqueId = '';

    chatForm = new FormGroup({
        userChat: new FormControl(''),
    });

    constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

    ngOnInit(): void {
        this.Chats.push(
            new Chat('Hello! This is BotRaja, How can I help you?', true)
        );
    }

    onSubmit() {
        let chat = this.chatForm.value.userChat;
        if (chat) {
            // bot's chatstripe
            this.uniqueId = this.generateUniqueId();
            this.Chats.push(new Chat(chat, false));

            // to focus scroll to the bottom
            const chatContainer = document.querySelector('#chat_container');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            // specific message div
            const messageDiv = document.getElementById(this.uniqueId);

            // messageDiv.innerHTML = "..."
            if (messageDiv) {
                this.loader(messageDiv);
            }
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
                    this.Chats.push(new Chat(res.bot.trim(), true));
                    console.log('Response - ' + res.bot.trim());
                },
                error: (err) => {
                    console.log('Error - ' + err.message);
                },
            });
    }

    typeText(element: any, text: string) {
        let index = 0;

        let interval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 20);
    }

    generateUniqueId() {
        const timestamp = Date.now();
        const randomNumber = Math.random();
        const hexadecimalString = randomNumber.toString(16);

        return `id-${timestamp}-${hexadecimalString}`;
    }

    loader(element: any) {
        element.textContent = '';

        this.loadInterval = setInterval(() => {
            // Update the text content of the loading indicator
            element.textContent += '.';

            // If the loading indicator has reached three dots, reset it
            if (element.textContent === '....') {
                element.textContent = '';
            }
        }, 300);
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
