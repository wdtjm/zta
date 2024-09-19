export function generateCalendarData(year, month) {
  // 获取指定月份的第一天
  const firstDayOfMonth = new Date(year, month, 1);
  // 获取指定月份的最后一天
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // 获取上个月的最后一天
  const lastDayOfPreviousMonth = new Date(year, month, 0);
  // 获取上个月的最后一个星期一
  let lastMondayOfPreviousMonth;
  if (lastDayOfPreviousMonth.getDay() === 1) {
    lastMondayOfPreviousMonth = new Date(lastDayOfPreviousMonth);
  } else {
    lastMondayOfPreviousMonth = new Date(lastDayOfPreviousMonth);
    lastMondayOfPreviousMonth.setDate(
      lastDayOfPreviousMonth.getDate() -
        ((lastDayOfPreviousMonth.getDay() + 6) % 7)
    );
  }

  // 获取下个月的第一天
  const firstDayOfNextMonth = new Date(year, month + 1, 1);

  // 获取下个月的第一个星期日
  let firstSundayOfNextMonth;
  if (firstDayOfNextMonth.getDay() === 0) {
    // 如果下个月的第一天是星期日
    firstSundayOfNextMonth = new Date(firstDayOfNextMonth);
  } else {
    // 否则，计算下一个星期日的日期
    firstSundayOfNextMonth = new Date(firstDayOfNextMonth);
    firstSundayOfNextMonth.setDate(
      firstDayOfNextMonth.getDate() + (7 - firstDayOfNextMonth.getDay())
    );
  }

  // 确定日历的起始日期
  let startDate;
  if (firstDayOfMonth.getDay() === 1) {
    startDate = firstDayOfMonth;
  } else {
    startDate = lastMondayOfPreviousMonth;
  }

  // 确定日历的结束日期
  let endDate;
  if (lastDayOfMonth.getDay() === 0) {
    endDate = lastDayOfMonth;
  } else {
    endDate = firstSundayOfNextMonth;
  }
  console.log(
    "start:",
    startDate.toISOString().split("T")[0],
    "end:",
    endDate.toISOString().split("T")[0]
  );
  // 初始化日历数据
  const calendarData = [{}, {}, {}, {}, {}, {}];

  // currentDate为startDate后面一天
  let currentDate = new Date(startDate);
  /* currentDate.setDate(currentDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1); */
  let i = 0;
  let j = 0;
  while (currentDate <= endDate) {
    calendarData[j][currentDate.getDay().toString()] = {
      date: new Date(currentDate),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === new Date().toDateString(),
      isSelected: false,
      todoList:[],
      month: currentDate.getMonth()+1,
      day: currentDate.getDate(),
      todoNum: 0
    };
    i++;

    if (i === 7) {
      i = 0;
      j++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return calendarData;
}
