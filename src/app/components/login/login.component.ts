import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  recordarUsuario = false;
  
  constructor(private auth: AuthService, private router:Router) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel();
    if (localStorage.getItem('Email')) {
      this.usuario.email = localStorage.getItem('Email')
    }
  }
  validarForm(form: NgForm) {
    if (form.invalid) { return }

      Swal.fire({
        title: 'Espere',
        icon: 'info',
      });
      Swal.showLoading();

    this.auth.login(this.usuario).subscribe(resp => {
      console.log(resp)
      Swal.close()
      this.router.navigate(['/home'])
      this.opcionRecordarUsuario()

    }, err => {
      console.log(err.error.error['message']);

      Swal.fire({
        allowOutsideClick: false,
        title: 'Datos erroneos',
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