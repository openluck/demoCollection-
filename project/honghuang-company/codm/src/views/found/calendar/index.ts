import { Component } from 'vue-property-decorator';
import BaseVue from '@helpers/BaseVue';
import zlkParser from '@helpers/ZLKParser';
import Empty from '@components/Empty';
// import { } from '@tencent/slug-function-vue';
import Loading from '@components/Loading';

interface ICalendarData {
  year: string;
  day: string;
  month: string;
  weeks: string[];
  isDay: number;
  current: ICalendar[];
  prev: ICalendar[];
  next: ICalendar[];
  dayList: ICalendar[][];
}

interface ICalendar {
  // y-m-d
  date: string;
  // 具体的日期
  day: number;
  // timeList: any[],
  disable: boolean;
  nowMonth: boolean;
  activeDay?: boolean;
  activeId?: number;
}

@Component({
  name: 'calendar',
  components: {
    Empty,
    Loading,
  },
})
export default class ActivityCalendarPage extends BaseVue {
  public loading = true;
  public beDay: string | null = null;

  public activeData: IActivityCalendarData[] = [];
  public calendar: ICalendarData = {
    // 日历
    dayList: this.initCalendarTable(), // 二维数组，循环行，循环列
    prev: [],
    current: [],
    next: [],
    year: '',
    day: '',
    month: '',
    weeks: ['一', '二', '三', '四', '五', '六', '日'],
    isDay: -1, // 判断是否是'今天',
  };

  private cacheActiveData: IActivityCalendarData[] = [];

  public created() {
    zlkParser
      .getActivityCalendarData()
      .then(data => {
        this.cacheActiveData = data;
        this.initTodayData();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  public isCurrentDay(day: string) {
    return parseInt(day, 10) === new Date().getDate();
  }

  public isAgo(day: string) {
    const d = new Date().getDate();
    return parseInt(day, 10) < d;
  }

  public handleChooseDate(day: string) {
    this.beDay = day;
    this.findActivityData(day);
  }

  private findActivityData(day: string) {
    const list: IActivityCalendarData[] = [];
    for (const item of this.cacheActiveData) {
      const { sj5a } = item;
      if (!sj5a) {
        continue;
      }
      const [start, end] = sj5a.split('-');
      if (this.checkActiveDate(day, start, end)) {
        list.push(item);
      }
    }
    this.activeData = list.sort((a, b) => {
      const end1 = a.sj5a.split('-')[1];
      const end2 = b.sj5a.split('-')[1];
      const t1 = new Date(end1).getTime();
      const t2 = new Date(end2).getTime();
      return t1 - t2;
    });
  }

  private checkActiveDate(day: string, start: string, end: string): boolean {
    const y = this.calendar.year;
    const m = this.calendar.month;
    const time = new Date(`${y}/${m}/${day}`).getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    if (time >= startTime && time <= endTime) {
      return true;
    }
    return false;
  }

  private initTodayData() {
    // 返回今天
    const date = new Date();
    const y = date.getFullYear();
    const m = this.parseData(date.getMonth() + 1);
    const d = this.parseData(date.getDate());
    this.calendar.year = `${y}`;
    this.calendar.month = m;
    this.calendar.day = d;
    this.currentDay();
    this.getmonthDays();
  }

  private parseData(val: number) {
    if (val < 10) {
      return `0${val}`;
    }
    return val.toString();
  }

  private getLastDate(year: number, month: number) {
    return new Date(year, month, 0);
  }

  private getmonthDays() {
    // 获取上月 当前月和下月天数
    const y = parseInt(this.calendar.year, 10);
    const m = parseInt(this.calendar.month, 10);
    this.calendar.current = [];
    this.calendar.prev = [];
    this.calendar.next = [];

    // 当前月天数
    for (let i = 1; i <= this.getLastDate(y, m).getDate(); i++) {
      // date用于日期判断，day用于显示，flag用于状态判断
      this.calendar.current.push({
        date: `${y}-${m}-${this.parseData(i)}`,
        day: i,
        disable: true,
        nowMonth: true,
      });
    }

    /* 上月*/
    const d = this.getLastDate(y, m - 1).getDate(); // 上月一共多少天
    // 上一年
    const preYear = m === 1 ? y - 1 : y; // 当前月是1月，那么上一月的年份要-1
    // 上一月
    const preMonth = m === 1 ? 12 : this.parseData(parseInt(`${m}`, 10) - 1); // 当前月是1月，那么上一月是12月
    for (let j = this.getLastDate(y, m - 1).getDay(); j >= 0; j--) {
      this.calendar.prev.push({
        date: `${preYear}-${preMonth}-${d - j}`,
        day: d - j,
        disable: true,
        nowMonth: false,
      });
    }

    /* 下月*/
    // 下一年
    const nextYear = m === 12 ? y + 1 : y; // 当前月是12月，那么下一月的年份要+1
    // 下一月
    const nextMonth = m === 12 ? '01' : this.parseData(parseInt(`${m}`, 10) + 1); // 当前月是12月，那么下一月是1月
    for (let k = 1; k <= 42 - this.calendar.current.length - this.calendar.prev.length + 1; k++) {
      this.calendar.next.push({
        date: `${nextYear}-${nextMonth}-${this.parseData(k)}`,
        day: k,
        disable: true,
        nowMonth: false,
      });
    }
    this.calendar.dayList = [];

    // 数组合并
    const tempArr = this.calendar.prev.concat(this.calendar.current, this.calendar.next);
    // 数组分组，每7个一组
    for (let i = 1; i < tempArr.length; i += 7) {
      const list = tempArr.slice(i, i + 7);
      this.calendar.dayList.push(list);
    }
  }

  private initCalendarTable() {
    const arr: ICalendar[][] = new Array(7); // 表格有10行
    for (let i = 0; i < arr.length; i++) {
      if (!Array.isArray(arr[i])) {
        arr[i] = [];
      }
      for (let k = 0; k < 6; k++) {
        arr[i].push({
          date: '',
          day: 0,
          disable: true,
          nowMonth: false,
          activeDay: false,
          activeId: 0,
        });
      }
    }
    return arr;
  }

  private currentDay() {
    // 获取今天,高亮显示今天
    const date = new Date();
    const d = date.getDate();
    this.calendar.isDay = d; // 获取到今天的号数
    this.findActivityData(`${d}`);
  }
}
