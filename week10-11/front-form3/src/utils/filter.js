import dayjs from 'moment'

const moment = (date) => {

    // 超过7田，显示日期
    if(dayjs(date).isBefore(dayjs().subtract(7, 'days'))){
      return dayjs(date).format('YYYY-MM-DD')
    } else {
      // 1小时前，xx小时前，X天前
      return dayjs(date).from(dayjs())
    }

}

export default {
  moment
}