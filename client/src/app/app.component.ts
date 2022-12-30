import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        let uniqueId = this.generateUniqueId();
        this.Chats.push(new Chat('', true, uniqueId));
        this.cd.detectChanges();
        this.typeText(uniqueId, 'Hello! This is BotRaja, How can I help you?');
        // this.Chats.push(
        //     new Chat(
        //         'Hello! This is BotRaja, How can I help you?',
        //         true,
        //         this.generateUniqueId()
        //     )
        // );
    }

    onSubmit() {
        let chat = this.chatForm.value.userChat;
        if (chat) {
            // bot's chatstripe
            let uniqueId = this.generateUniqueId();
            this.Chats.push(new Chat(chat, false, this.generateUniqueId()));
            this.cd.detectChanges();

            this.chatForm.reset();

            // to focus scroll to the bottom
            const chatContainer = document.querySelector('#chat_container');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            this.getResponse(chat);

            // specific message div
            const messageDiv = document.getElementById(this.uniqueId);

            // messageDiv.innerHTML = "..."
            if (messageDiv) {
                this.loader(messageDiv);
            }
        }

        console.log('submit clicked - ' + this.chatForm.value.userChat);
    }

    getResponse(prompt: string) {
        let uniqueId = this.generateUniqueId();
        this.Chats.push(new Chat('', true, uniqueId));
        this.cd.detectChanges();

        const messageDiv = document.getElementById(uniqueId);

        // messageDiv.innerHTML = "..."
        if (messageDiv) {
            this.loader(messageDiv);
        }
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
                    let updateChat = this.Chats.find(
                        (x) => x.divId === uniqueId
                    );
                    if (updateChat) {
                        let index = this.Chats.indexOf(updateChat);
                        this.typeText(uniqueId, res.bot.trim());

                        // this.Chats[index] = new Chat(
                        //     res.bot.trim(),
                        //     true,
                        //     uniqueId
                        // );
                    }
                    console.log('Response - ' + res.bot.trim());
                },
                error: (err) => {
                    this.Chats.push(
                        new Chat(
                            'Something went wrong. Please check logs.',
                            true,
                            uniqueId
                        )
                    );
                    console.log('Error - ' + err.message);
                },
            });
    }

    typeText(uniqueId: string, text: string) {
        clearInterval(this.loadInterval);
        const messageDiv = document.getElementById(uniqueId);
        let index = 0;

        let interval = setInterval(() => {
            if (messageDiv && index < text.length) {
                messageDiv.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 40);
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
    constructor(message: string, isBot: boolean, divId: string) {
        this.message = message;
        this.isBot = isBot;
        this.divId = divId;
    }
    message: string;
    isBot: boolean;
    divId: string;
}
