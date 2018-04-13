import { Genero } from './../../../@core/data/models/genero';
import { Persona } from './../../../@core/data/models/persona';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PersonaService } from '../../../@core/data/persona.service';
import { FORM_PERSONA } from './form-persona';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import  Swal  from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

//const swal: SweetAlert = _swal as any;

@Component({
  selector: 'ngx-crud-persona',
  templateUrl: './crud-persona.component.html',
  styleUrls: ['./crud-persona.component.scss'],
})
export class CrudPersonaComponent implements OnInit {
  config: ToasterConfig;
  userid:number;

  @Input('userid')
  set name(userid: number) {
    this.userid = userid;
    this.loadPersona();
  }

  @Output('eventchange') eventChange: EventEmitter<boolean> = new EventEmitter();

  info_persona:Persona;
  formPersona: any;
  regPersona:any;
  clean:boolean;

  constructor(private personaService: PersonaService, private toasterService: ToasterService) {
    this.formPersona = FORM_PERSONA;
    this.loadOptionsPais();
   }

  public loadPersona(): void {
    console.log("userid",this.userid)
    if (this.userid !== undefined && this.userid !== 0) {
      this.personaService.get('persona/?query=id:' + this.userid)
        .subscribe(res => {
          if (res !== null) {
            console.log(res);
            this.info_persona = <Persona>res[0];
          }
        });
    } else  {
      this.info_persona = undefined;
      this.clean = !this.clean;
    }
  }

  updatePersona(persona: any): void {

    var opt: any={
      title: "Update?",
      text: "Update Persona!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    };
    Swal(opt)
    .then((willDelete) => {
      console.log("will",willDelete);
      if (willDelete) {
        this.info_persona = <Persona>persona;
        this.personaService.put('persona', this.info_persona)
          .subscribe(res => {
            this.loadPersona();
            this.eventChange.emit(true);
            this.showToast('info', 'updated', 'Persona updated');
          });
      }
    });
  }

  createPersona(persona: any): void {
    var opt: any={
      title: "Create?",
      text: "Create Persona!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    };
    Swal(opt)
    .then((willDelete) => {
      console.log("will",willDelete);
      if (willDelete) {
        this.info_persona = <Persona>persona;
        this.personaService.post('persona', this.info_persona)
          .subscribe(res => {
            this.info_persona = <Persona>res;
            this.eventChange.emit(true);
            this.showToast('info', 'created', 'Persona created');
          });
      }
    });
  }

  loadOptionsPais(): void {
    let genero: Array<any> = [];
    this.personaService.get('genero/?limit=0')
      .subscribe(res => {
        if (res !== null) {
          genero = <Array<Genero>>res;
          genero.forEach(element => {
            Object.defineProperty(element, 'valor',
            Object.getOwnPropertyDescriptor(element, 'Nombre'));
          });
        }
        this.formPersona.campos[7].opciones = genero;
      });
  }

  ngOnInit() {
    this.loadPersona();
  }

  validarForm(event) {
    console.log("event",event)
    if (event.valid) {
      console.log(this.info_persona);
      if (this.info_persona === undefined) {
        this.createPersona(event.data.Persona);
      } else {
        this.updatePersona(event.data.Persona);
      }
    }
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center'
      positionClass: 'toast-top-center',
      timeout: 5000,  // ms
      newestOnTop: true,
      tapToDismiss: false, // hide on click
      preventDuplicates: true,
      animation: 'slideDown', // 'fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'
      limit: 5,
    });
    const toast: Toast = {
      type: type, // 'default', 'info', 'success', 'warning', 'error'
      title: title,
      body: body,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

}
