import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { EmailNewPasswordComponent } from './email-new-password/email-new-password.component';
import { MainboardComponent } from './mainboard/mainboard.component';
import { MenuComponent } from './mainboard-components/menu/menu.component';
import { ThreadComponent } from './mainboard-components/thread/thread.component';
import { PopupForThreadComponent } from './popup-windows/popup-for-thread/popup-for-thread.component';
import { PopupReactionsComponent } from './popup-windows/popup-reactions/popup-reactions.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { EditChannelComponent } from './edit-channel/edit-channel.component';
import { MembersMainboardHeadlineComponent } from './mainboard-components/members-mainboard-headline/members-mainboard-headline.component';
import { AddMembersMainboardHeadlineComponent } from './mainboard-components/add-members-mainboard-headline/add-members-mainboard-headline.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ImprintComponent } from './imprint/imprint.component';
import { DataprotectionComponent } from './dataprotection/dataprotection.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire/compat';
import { provideStorage, getStorage } from "@angular/fire/storage";
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { LOCALE_ID } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    PasswordResetComponent,
    EmailNewPasswordComponent,
    MainboardComponent,
    PopupForThreadComponent,
    MenuComponent,
    ThreadComponent,
    PopupReactionsComponent,
    CreateChannelComponent,
    EditChannelComponent,
    MembersMainboardHeadlineComponent,
    AddMembersMainboardHeadlineComponent,
    ProfileDetailsComponent,
    ImprintComponent,
    DataprotectionComponent,
    EmojiPickerComponent,

  ],

  imports: [
    PickerModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule,
    AngularFireModule.initializeApp({ "projectId": "dabub-3dde6", "appId": "1:1069097652276:web:078a0f97d1be6bdf697a61", "storageBucket": "dabub-3dde6.appspot.com", "apiKey": "AIzaSyBKczVzCCDNMETdCGe5_SJYpcxot_BBvQ0", "authDomain": "dabub-3dde6.firebaseapp.com", "messagingSenderId": "1069097652276" }),
    provideFirebaseApp(() => initializeApp({ "projectId": "dabub-3dde6", "appId": "1:1069097652276:web:078a0f97d1be6bdf697a61", "storageBucket": "dabub-3dde6.appspot.com", "apiKey": "AIzaSyBKczVzCCDNMETdCGe5_SJYpcxot_BBvQ0", "authDomain": "dabub-3dde6.firebaseapp.com", "messagingSenderId": "1069097652276" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
  ],

  providers: [LoginComponent, {provide: LOCALE_ID, useValue: 'de' }],
  bootstrap: [AppComponent],
})

export class AppModule { }
