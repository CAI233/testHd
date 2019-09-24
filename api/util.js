/**
 * 获取当前时间 yyyy-MM-dd HH-mm-ss
 */
function getCurrentDate(format) {
  var now = new Date();
  var old =  new Date(now.getTime()-24*60*60*1000);
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  var day = now.getDay();//得到周几
  var hour = now.getHours();//得到小时
  var minu = now.getMinutes();//得到分钟
  var sec = now.getSeconds();//得到秒

  var oldyear = old.getFullYear(); //得到年份
  var oldmonth = old.getMonth();//得到月份
  var olddate = old.getDate();//得到日期
  var oldday = old.getDay();//得到周几
  var oldhour = old.getHours();//得到小时
  var oldminu = old.getMinutes();//得到分钟
  var oldsec = old.getSeconds();//得到秒
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;

  oldmonth = oldmonth + 1;
  if (oldmonth < 10) oldmonth = "0" + oldmonth;
  if (olddate < 10) olddate = "0" + olddate;
  if (oldhour < 10) oldhour = "0" + oldhour;
  if (oldminu < 10) oldminu = "0" + oldminu;
  if (oldsec < 10) oldsec = "0" + oldsec;
  var time = "";

  //精确到天
  if(format==1){
    time = year + "-" + month + "-" + date;
  }
  //精确到分
  else if(format==2){
    time = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
  }
  else if(format==3){
    time = month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
  }else if(format==4){
    time = year + month + date;
  }else if(format==5){
    time = year + month + date + hour + minu +sec;
  }else if(format==6){//昨天 
    time = oldyear + "-" + oldmonth + "-" + olddate;
  }
  return time;
}
export {getCurrentDate}