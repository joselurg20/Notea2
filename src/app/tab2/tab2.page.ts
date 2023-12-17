import { Component,inject } from '@angular/core';
import {AlertController, IonicModule, LoadingController, ModalController} from '@ionic/angular'
  import {FormBuilder,FormGroup,FormsModule,
  ReactiveFormsModule,Validators} from '@angular/forms';
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LefletComponent } from '../components/leflet/leflet.component';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';
import { Position } from '../model/position';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule,
  FormsModule,ReactiveFormsModule, LefletComponent, CommonModule],
})
export class Tab2Page {
  [x: string]: any;
  rutaImagenTomada: string = '';
  public form!:FormGroup;
  private formB = inject(FormBuilder);
  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);
  private myLoading!:HTMLIonLoadingElement;
  public position:Position= {
    latitude: '',
    longitude: '' 
  }

  

  public mostrarImagen: boolean = true;

  constructor(private modalController: ModalController, 
    private alertController: AlertController) {
    this.form = this.formB.group({
      title:['',[Validators.required,Validators.minLength(4)]],
      description:[''], 
      img:['']
    });
  }


  public async saveNote(): Promise<void> {
    if (!this.form.valid) return;
    
    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: Date.now().toLocaleString(),
      img: this.rutaImagenTomada , // Asigna la ruta de la imagen a la propiedad 'img' de la nota
      position: this.position
    };
  
    await this.UIS.showLoading();
    
    try {
      await this.noteS.addNote(note); // Guarda la nota en la base de datos
      this.form.reset();
      this.rutaImagenTomada = ''; // Restablece la ruta de la imagen a una cadena vacía
      this.mostrarImagen = false; // Establece la variable mostrarImagen a false para ocultar la tarjeta de la imagen
      await this.UIS.showToast("Nota introducida correctamente","success");
    } catch(error) {
      await this.UIS.showToast("Error al insertar la nota","danger");
    } finally {
      await this.UIS.hideLoading();
    }
  }

  private async convertAndSaveImage(imagePath: string): Promise<void> {
    try {
      const base64Data = await this.convertImageToBase64(imagePath);
      // Do something with the base64Data, for example, save it in the 'img' property of the form
      this.form.patchValue({ img: base64Data });
    } catch (error) {
      console.error('Error converting and saving image:', error);
    }
  }

  private async convertImageToBase64(imagePath: string): Promise<string> {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const base64Data = await this.blobToBase64(blob);
      return base64Data;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return '';
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public async takePic(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
      });

      this.rutaImagenTomada = '' + image.base64String;
      await this.convertAndSaveImage(this.rutaImagenTomada);
    } catch (error) {
      console.error('Error', error);
    }
  }

  public async takePosition(): Promise<void> {
    await this.UIS.showLoading();
      try {
        const coordinates = await Geolocation.getCurrentPosition();
      if(coordinates && coordinates.coords.latitude && coordinates.coords.longitude){
        this.position = {
          latitude: JSON.stringify(coordinates.coords.latitude),
          longitude: JSON.stringify(coordinates.coords.longitude)
        }
      }
      } catch (error) {
        console.error(error)
      } finally{
        await this.UIS.hideLoading();
      }

  }
  

  public async deletePic(): Promise<void> {
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

  async clearLocation() {
    const alert = await this.alertController.create({
      header: 'Borrar ubicación',
      message: '¿Estás seguro de que quieres borrar la ubicación?',
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
            this.position = {
              latitude: '',
              longitude: ''
            };
            console.log('Ubicación borrada');
          }
        }
      ]
    });
  
    await alert.present();
  }
}