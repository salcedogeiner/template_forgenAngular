import { Genero } from './../../../@core/data/models/genero';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PersonaService } from '../../../@core/data/persona.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-list-persona',
  templateUrl: './list-persona.component.html',
  styleUrls: ['./list-persona.component.scss'],
  })
export class ListPersonaComponent implements OnInit {
  uid: number;
  cambiotab: boolean = false;
  config: ToasterConfig;
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    mode: 'external',
    columns: {
      Id: {
        title: 'Id',
        type: 'number',
      },
      PrimerNombre: {
        title: 'Primer Nombre',
        type: 'string',
      },
      SegundoNombre: {
        title: 'Segundo Nombre',
        type: 'string',
      },
      PrimerApellido: {
        title: 'Primer Apellido',
        type: 'string',
      },
      SegundoApellido: {
        title: 'Segundo Apellido',
        type: 'string',
      },
      Usuario: {
        title: 'Usuario',
        type: 'string',
      },
      Ente: {
        title: 'Ente',
        type: 'number',
      },
      FechaNacimiento: {
        title: 'FechaNacimiento',
        type: 'Date',
      },
      Foto: {
        title: 'Foto',
        type: 'number',
      },
      Genero: {
        title: 'Genero',
        type: 'text',
        valuePrepareFunction: (value) => {
          return value.Nombre;
        }
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private personaService: PersonaService, private toasterService: ToasterService) {
    this.loadData();
  }

  loadData(): void {
    this.personaService.get('persona/?limit=0').subscribe(res => {
      if (res !== null) {
        const data = <Array<any>>res;
        data.forEach(element => {
          element.Genero={Id:1,Nombre:"as"}
        });
        this.source.load(data);
          }
    });
  }

  ngOnInit() {
  }

  onEdit(event): void {
    this.uid = event.data.Id;
    this.activetab();
  }

  onCreate(event): void {
    this.uid = 0;
    this.activetab();
  }

  onDelete(event): void {
    var opt: any={
      title: "Deleting?",
      text: "Delete Persona!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    };
    Swal(opt)
    .then((willDelete) => {
      console.log("will",willDelete);
      if (willDelete) {
        this.personaService.delete('persona/', event.data).subscribe(res => {
          if (res !== null) {
            this.loadData();
            this.showToast('info', 'deleted', 'Persona deleted');
            }
         });
      }
    });
  }

  activetab(): void {
    this.cambiotab = !this.cambiotab;
  }

  selectTab(event): void {
    if (event.tabTitle === 'Lista') {
      this.cambiotab = false;
    } else {
      this.cambiotab = true;
    }
  }

  onChange(event){
    if (event) {
      this.loadData();
      this.cambiotab = !this.cambiotab;
    }
  }


  itemselec(event): void {
    //swal("Hello world!");
    //swal("Hello world!");
    console.log("afssaf");
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      positionClass: 'toast-top-center', // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center'
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
