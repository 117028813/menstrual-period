import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  url = 'http://localhost:3000'

  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }

}
