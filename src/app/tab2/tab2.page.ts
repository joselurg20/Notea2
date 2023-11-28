import { Component, inject } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonicModule } from '@ionic/angular';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent]
})
export class Tab2Page {

  public noteS = inject(NoteService);

  constructor() {}

  ionViewDidEnter(){
    this.noteS.readAll();
  }

  editNote(){
    
  }

  removeNote(){

  }

}
