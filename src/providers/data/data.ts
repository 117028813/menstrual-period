import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  constructor(
    public http: HttpClient,
  ) {
    console.log('Hello DataProvider Provider');
  }

  getMenstrual() {
    return JSON.parse(localStorage.getItem('menstrual'))
  }

  addMenstrual(data) {
    const menstrual = JSON.parse(localStorage.getItem('menstrual')) || []
    menstrual.push(data)
    localStorage.setItem('menstrual', JSON.stringify(menstrual))
  }

  deleteMenstrual(item) {
    let menstrual = JSON.parse(localStorage.getItem('menstrual'))
    menstrual = menstrual.filter(val => val.date !== item.date)
    localStorage.setItem('menstrual', JSON.stringify(menstrual))
  }

}
