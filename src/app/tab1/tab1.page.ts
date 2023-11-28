import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonModal, IonDatetimeButton, IonButton, IonIcon, LoadingController } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { IonicModule } from '@ionic/angular';
import { UIService } from '../services/ui.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule],
})
export class Tab1Page {
  public form !: FormGroup;
  private formB = inject(FormBuilder);
  private noteS = inject(NoteService)
  private loadingS = inject(LoadingController)
  private UiS = inject(UIService)
  private myLoading!: HTMLIonLoadingElement;
  constructor() {
    this.form = this.formB.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['']
    });
  }


  public async savesNotes(): Promise<void> {
    if (!this.form.valid) return;
    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: Date.now().toLocaleString()
    }
    console.log(note);
    this.myLoading = (await this.loadingS.create({}));
    this.myLoading.present();

    await this.UiS.showLoading();
    try {
      await this.noteS.addNote(note);
      this.form.reset();
      await this.UiS.showToast("Nota introducida correctamente", "success");
    } catch (error) {
      await this.UiS.showToast("Nota introducida correctamente", "dismiss");
    } finally {
      this.UiS.hideLoading();
    }
  }
}
