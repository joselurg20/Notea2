import { Injectable,inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  private loadingC = inject(LoadingController);
  private toastC = inject(ToastController);
  private loadingElement:any;
  constructor() {}

  showLoading(msg?:string):Promise<void>{
    return new Promise( async (resolve,reject)=>{
      if (this.loadingElement&& this.loadingElement.isOpen) {
        resolve();
      }else{
        this.loadingElement= await this.loadingC.create({message:msg});
        
        resolve();
      }
    })
  }

  async hideLoading(): Promise<void>{
    if (!this.loadingElement ||this.loadingElement.isOpen) return; 
     await this.loadingElement.dismiss();  
      
    } 

    async showToast(msg:string,
      duration:number= 3000,
      position: "bottom" | "top" | "middle" | undefined,
      color:string='primaty'): Promise<void>{
     await this.toastC.create({
        message:msg,
        duration:duration,
        position:position,
        color:color,
        translucent:true
      });
      toast.present();
    }


}
