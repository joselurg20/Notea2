import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../../model/note';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { AlertController } from '@ionic/angular';
import { LefletComponent } from "../leflet/leflet.component";

@Component({
  selector: 'app-editcontroller',
  templateUrl: './editcontroller.component.html',
  styleUrls: ['./editcontroller.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, LefletComponent]
})
export class EditcontrollerComponent implements OnInit {

  @Input() note!: Note;
  public noteS: NoteService;
  rutaImagenTomada: string ='';

  constructor(noteS: NoteService, private modalController: ModalController, private alertController: AlertController,) {
    this.noteS = noteS;
  }

  ngOnInit(): void {
  }

  saveChanges() {
    this.noteS.updateNote(this.note)
      .then(() => {
        this.modalController.dismiss();
      })
      .catch((error) => {
        console.error("Error al actualizar la nota:", error);
      });
  }

  close() {
    this.modalController.dismiss();
  }

   async deletePic(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Borrar foto',
      message: '¿Estás seguro de que quieres borrar la foto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            this.rutaImagenTomada = '';
            console.log('Foto borrada');
          }
        }
      ]
    });
  
    await alert.present();
  }

}
