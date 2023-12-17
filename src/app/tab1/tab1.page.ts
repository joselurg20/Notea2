import { Component,ViewChild,inject } from '@angular/core';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable, from, map, mergeMap, tap, toArray } from 'rxjs';
import { EditcontrollerComponent } from '../components/editcontroller/editcontroller.component';
import { LefletComponent } from '../components/leflet/leflet.component';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, LefletComponent, EditcontrollerComponent],
})
export class Tab1Page {
  public notes:any[]=[];
  //public noteS = inject(NoteService);
  public _notes$: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private lastNote: Note | undefined = undefined;
  private notesPerPage: number = 15;
  public isInfiniteScrollAvailable: boolean = true;  //noteS.notes$

  public _editNote!: Note;
  public _deleteNote!: Note;


  constructor(public platform: Platform,
    public noteS: NoteService,
    public modalController: ModalController,
    private alertController: AlertController) {
    console.log("CONS")
  }

  ionViewDidEnter() {
  this.noteS.notes$.subscribe((data) =>{
    this.notes=data;
  })
  }

  async editNote($event:Note) {
     this._editNote = $event;
    
      const modal = await this.modalController.create({
        component: EditcontrollerComponent,
        componentProps: {
          note: $event
        }
      });
    
      await modal.present();
  }
  async deleteNote(event: any, note: any) {
    event.stopPropagation(); // Evita la propagación del evento si es necesario

    const result = await this.presentAlertConfirm();
    if (result) {
      try {
        await this.noteS.deleteNote(note);
        this.notes = this.notes.filter((n: any) => n.key !== note.key);
        console.log('Nota eliminada con éxito');
      } catch (error) {
        console.error('Error al eliminar la nota', error);
      }
    }
  }

  loadNotes(fromFirst:boolean, event?:any){
    if(fromFirst==false && this.lastNote==undefined){
      this.isInfiniteScrollAvailable=false;
      event.target.complete();
      return;
    } 
    this.convertPromiseToObservableFromFirebase(this.noteS.readNext(this.lastNote,this.notesPerPage)).subscribe(d=>{
      event?.target.complete();
      if(fromFirst){
        this._notes$.next(d);
      }else{
        this._notes$.next([...this._notes$.getValue(),...d]);
      }
    })
    
  }

  private convertPromiseToObservableFromFirebase(promise: Promise<any>): Observable<Note[]> {
    return from(promise).pipe(
      tap(d=>{
        if(d.docs && d.docs.length>=this.notesPerPage){
          this.lastNote=d.docs[d.docs.length-1];
        }else{
          this.lastNote=undefined;
        }
      }),
      mergeMap(d =>  d.docs),
      map(d => {
        return {key:(d as any).id,...(d as any).data()};
      }),
      toArray()
    );
  }

  async presentAlertConfirm() {
    return new Promise<boolean>(async resolve => {
      const alert = await this.alertController.create({
        header: 'Confirmar',
        message: '¿Estás seguro de que deseas eliminar esta nota?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve(false)
          },
          {
            text: 'Aceptar',
            handler: () => resolve(true)
          }
        ]
      });

      alert.present();
    });
  }

  
  doRefresh(event: any) {
    this.isInfiniteScrollAvailable=true;
    this.loadNotes(true,event);
  }

  loadMore(event: any) {
    this.loadNotes(false,event);
  }

}