const Holidays = ['2020/01/01',
  '2020/2/24',
  '2020/2/25',
  '2020/2/26',
  '2020/2/27',
  '2020/2/28',
  '2020/2/29',
  '2020/3/1',
  '2020/3/2',
  '2020/4/4',
  '2020/4/5',
  '2020/4/6',
  '2020/5/1',
  '2020/5/2',
  '2020/5/3',
  '2020/5/4',
  '2020/5/5',
  '2020/6/25',
  '2020/6/26',
  '2020/6/27',
  '2020/10/1',
  '2020/10/2',
  '2020/10/3',
  '2020/10/4',
  '2020/10/5',
  '2020/10/6',
  '2020/10/7',
  '2020/10/8',
];

/**
 * 判断当前日期是否是节假日
 * @param day 判断的日期
 * @return {boolean} 是否是节假日
 */
export const isHoliday = (day) => Holidays.indexOf(`${day.getFullYear()}/${day.getMonth() + 1}/${day.getDate()}`) !== -1;

/**
 * 获取下一个工作日（不包含周末，周日）
 * @return {Date} 下一个工作日
 */
export function nextWorkingDate() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
  while (isHoliday(date)
    || date.getDay() === 6
    || date.getDay() === 0) {
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
  }
  return date;
}
