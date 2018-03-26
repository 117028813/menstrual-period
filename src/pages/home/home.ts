import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  menstrualList
  newMenstrual
  averageCycle

  constructor(
    public navCtrl: NavController,
    private dataService: DataProvider
  ) {}

  ionViewDidLoad() {
    this.menstrualList = JSON.parse(this.dataService.getMenstrual()) || []
    this.menstrualList.forEach(val => {
      val.dateObj = new Date(val.date)
    })
    this.sortMenstrualList()
    this.computeMenstrualCycle()
    this.computeAverageCycle()
  }

  addMenstrual() {
    this.menstrualList.push({
      date: new Date(this.newMenstrual).getTime(),
      dateObj: new Date(this.newMenstrual)
    })
    this.sortMenstrualList()
    this.computeMenstrualCycle()
    this.computeAverageCycle()
    this.dataService.addMenstrual({
      date: new Date(this.newMenstrual).getTime()
    })
    this.newMenstrual = ''
  }

  deleteMenstrual(item) {
    this.menstrualList = this.menstrualList.filter(val => val.date !== item.date)
    this.computeMenstrualCycle()
    this.computeAverageCycle()
    this.dataService.deleteMenstrual(item)
  }

  computeMenstrualCycle() {
    this.menstrualList.forEach((val, ind, arr) => {
      if (ind === 0) {
        val.cycle = null
      } else {
        val.cycle = (val.date - arr[ind - 1].date) / 1000 / 60 / 60 /24
      }
    })
  }

  computeAverageCycle() {
    let cycleAmount = 0
    this.menstrualList.forEach((val, ind, arr) => {
      if (val.cycle) {
        cycleAmount += val.cycle
      }
    })
    if (this.menstrualList.length > 1) {
      this.averageCycle = cycleAmount / (this.menstrualList.length - 1)
    } else {
      this.averageCycle = 28
    }
  }

  sortMenstrualList() {
    this.menstrualList.sort((a, b) => {
      return a.date - b.date
    })
  }

}
