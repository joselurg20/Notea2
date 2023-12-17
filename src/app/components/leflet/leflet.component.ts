// leaflet.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import * as L from 'leaflet';
import { Position } from 'src/app/model/position';
import { Icon, marker } from 'leaflet';

@Component({
  selector: 'app-leflet',
  templateUrl: './leflet.component.html',
  styleUrls: ['./leflet.component.scss'],
  standalone: true,
  imports: [IonicModule,LefletComponent],
})
export class LefletComponent implements OnInit {

  @Input() position!:Position;


  private map: L.Map | undefined;

  public location!: any;

  ngOnInit() {
    if(this.position && this.position.latitude && this.position.longitude) {
      this.location = {
        latitude: this.position.latitude,
        longitude: this.position.longitude
      }
      this.initializeMap();
    }
  }

  private initializeMap() {
   
    const mapElement = document.getElementById('leaflet-map');

    if (mapElement) {
      this.map = L.map(mapElement).setView([this.location.latitude, this.location.longitude], 2); // Initial view, adjust as needed

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      marker([this.location.latitude, this.location.longitude], {
        icon: L.icon({
          ...Icon.Default.prototype.options,
          iconUrl:'leaflet/marker-icon.png',
          iconRetinaUrl:'leaflet/marker-icon-2x.png',
          shadowUrl:'leaflet/marker-shadow.png'
        })
      }).addTo(this.map);

    }
  }
  closeModal() {}
}
