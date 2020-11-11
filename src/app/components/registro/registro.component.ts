import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarUsuario=false

  constructor(private auth: AuthService,  private router:Router) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel();
    // this.usuario.email = 'dilanjleons@gmail.com'
  }
  validarForm(form: NgForm) {
    if (form.invalid) { return }
    Swal.fire({
      title: 'Espere',
      icon: 'info',
    });
    Swal.showLoading();

    this.auth.registrar(this.usuario).subscribe(
      resp => {
         console.log(resp) 
         Swal.close()
         this.router.navigate(['/home'])
         this.opcionRecordarUsuario()
        }, err => {
      console.log(err.error.error['message']);

      Swal.fire({
        allowOutsideClick: false,
        title: 'Correo ya existente',
        text: err.error.error['message'],
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
    })
  }

  opcionRecordarUsuario(){
    if (this.recordarUsuario) {
      localStorage.setItem('Email', this.usuario.email)
    }

}
}