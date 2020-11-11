import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UsuarioModel } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = ' https://identitytoolkit.googleapis.com/v1/accounts:sign'
  private apiKey = 'AIzaSyCCPQ2MWihaSSkEhZN4qzxe5pb6-Udg9_M'

  userToken: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.leerToken()

  }

  // -------------------PETICIONES A LA API---------------------------------
  peticion(usuario: UsuarioModel, endpoint: string) {
    const authData = {
      // email:usuario.email,
      // password:usuario.password

      // lo anterior se reemplazo por el operador spread ( ...) a continuacion
      ...usuario,
      returnSecureToken: true
    }
    return this.http.post(`${this.url}${endpoint}${this.apiKey}`, authData).pipe(map(resp => {
      this.guardarToken(resp['idToken'])
      return resp
    }));
  }


  // -------------------SECCION DE LA SESION---------------------------------
  logaut() { }

  login(usuario: UsuarioModel) {
    const endpoint = 'InWithPassword?key='
    return this.peticion(usuario, endpoint)

  }

  registrar(usuario: UsuarioModel) {
    const endpoint = 'Up?key='
    return this.peticion(usuario, endpoint)

  }

  // -------------------SECCION DEL TOKEN---------------------------------


  private guardarToken(idToken: string) {
    let fechaExpiracion = new Date();
    fechaExpiracion.setSeconds(3600)
    localStorage.setItem('expira', fechaExpiracion.getTime().toString())

    this.userToken = idToken;
    localStorage.setItem('Token', idToken)
  }



  private leerToken() {
    if (localStorage.getItem('Token')) {
      this.userToken = localStorage.getItem('Token')
    }
  }
  destruirToken() {
    localStorage.removeItem('Token')
  }
  autenticado(): boolean {
    
    if (this.userToken.length > 2) {
      return true
    }

    let expira = Number(localStorage.getItem('expira'))
    let expiraDate = new Date()
    expiraDate.setTime(expira)

    if (expiraDate> new Date()) {
        return true
    }else{
      return false
    }
  }

}

