import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'client'
    Chats: string[] = []

    chatForm = new FormGroup({
        userChat: new FormControl(''),
    })

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {}

    onSubmit() {
        let chat = this.chatForm.value.userChat
        if (chat) {
            this.Chats.push(chat)
        }

        console.log('submit clicked - ' + this.chatForm.value.userChat)
    }
}
