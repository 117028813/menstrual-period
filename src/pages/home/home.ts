import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { CalendarModal, CalendarModalOptions, DayConfig } from 'ion2-calendar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  menstrualList
  newMenstrual
  averageCycle
  day2Millisecond = 24 * 60 * 60 * 1000
  seeCalendarButton = true

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
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
    this.seeCalendarButton = this.menstrualList.length ? true : false
  }

  addMenstrual() {
    // this.menstrualList.push({
    //   date: new Date(this.newMenstrual).getTime(),
    //   dateObj: new Date(this.newMenstrual)
    // })
    // this.sortMenstrualList()
    // this.computeMenstrualCycle()
    // this.computeAverageCycle()
    // this.dataService.addMenstrual({
    //   date: new Date(this.newMenstrual).getTime()
    // })
    // this.newMenstrual = ''
    // this.seeCalendarButton = this.menstrualList.length ? true : false

    const options: CalendarModalOptions = {
      title: '添加日期',
      monthFormat: 'YYYY年MM月',
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      weekStart: 1,
      closeLabel: '取消',
      doneLabel: '确定',
      from: new Date(2018, 0, 1),
      to: new Date()
    }
    let calendar = this.modalCtrl.create(CalendarModal, {
      options
    })
    calendar.present()
    calendar.onDidDismiss(date => {
      if (!date) {
        return
      }
      this.menstrualList.push({
        date: date.time,
        dateObj: date.dateObj
      })
      this.dataService.addMenstrual({
        date: date.time
      })
      this.sortMenstrualList()
      this.computeMenstrualCycle()
      this.computeAverageCycle()
      this.seeCalendarButton = this.menstrualList.length ? true : false
    })
  }

  deleteMenstrual(item) {
    let alert = this.alertCtrl.create({
      title: '确定删除吗？',
      buttons: [
        {
          text: '取消'          
        },
        {
          text: '确定',
          handler: () => {
            this.menstrualList = this.menstrualList.filter(val => val.date !== item.date)
            this.computeMenstrualCycle()
            this.computeAverageCycle()
            this.dataService.deleteMenstrual(item)
            this.seeCalendarButton = this.menstrualList.length ? true : false
          }
        }
      ]
    })
    alert.present()
  }

  computeMenstrualCycle() {
    this.menstrualList.forEach((val, ind, arr) => {
      if (ind === 0) {
        val.cycle = null
      } else {
        val.cycle = Number( ( (val.date - arr[ind - 1].date) / this.day2Millisecond ).toFixed(0) )
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

  openCalendar() {
    const lastDateMill = this.menstrualList[this.menstrualList.length - 1].date // 最近一次来事日期
    const nextDateMill = lastDateMill + this.averageCycle * this.day2Millisecond // 根据平均周几计算的下次来事日期
    const ovulationMill = nextDateMill - 14 * this.day2Millisecond // 排卵期

    const daysConfig: DayConfig[] = []
    for (let i = 0; i < 5; i++) {
      daysConfig.push({
        date: new Date(lastDateMill + i * this.day2Millisecond),
        cssClass: 'menstrual'
      }, {
        date: new Date(nextDateMill + i * this.day2Millisecond),
        cssClass: 'menstrual'
      })
    }
    for (let i = 0; i < 10; i++) {
      daysConfig.push({
        date: new Date(ovulationMill - 5 * this.day2Millisecond + i * this.day2Millisecond),
        cssClass: 'dangerous'
      })
    }

    const options: CalendarModalOptions = {
      title: '安全期日历',
      cssClass: 'calendar',
      monthFormat: 'YYYY年MM月',
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      weekStart: 1,
      closeLabel: '关闭',
      doneLabel: null,
      from: new Date(lastDateMill),
      to: new Date(nextDateMill + 4 * this.day2Millisecond),
      daysConfig: daysConfig
    }
    
    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options
    })
    myCalendar.present()
  }

}
