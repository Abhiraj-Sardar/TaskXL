var dayIndex = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var day=0;
var hour = "00";
var minute = "00";
var second = "00";
var startTime = ""; //after 24h it should be reset to ""
var endTime = ""; //after 24h it should be reset to ""
var remainingTimeToday=""; //It should persist it's value
var currentHoursLeft = 0;
var currentMinutesLeft = 0;
var showHoursLeft = 0;
var showTotalMinutesLeft = 0;
var savedTimeInMinutes=0;
var showMinutesRatio=0;
var totalCurrentMinutesLeft=0;
var bufferTime = 0;
var endTime="";


const popupTime = document.getElementById('popup-time');
const statusCheckIn = document.getElementById("status-format-checkIn");
const statusCheckOut = document.getElementById("status-format-checkOut");
const statusExtraTime =document.getElementById("status-format-extra-time");
const statusBufferTime = document.getElementById("status-format-buffer-time");
const checkInBtn = document.getElementById("setCheckInbtn");
const checkOutBtn = document.getElementById("setCheckOutbtn");
const flushBtn = document.getElementById("flushBtn");

// async function updateBufferTime(){
//   initLastBufferTime();
//   bufferTime = bufferTime + savedTimeInMinutes;
//   await chrome.storage.local.set({ 
//       lastBufferTime:bufferTime
//   });
// }

// async function initLastBufferTime(){
//   const result = await chrome.storage.local.get({lastBufferTime:0});
//   bufferTime = result.lastBufferTime;
// }

async function flushBufferData(){
    bufferTime = 0;
    await chrome.storage.local.set({ 
      lastBufferTime:bufferTime
    });
}

flushBtn.addEventListener("click",()=>{
    flushBufferData();
});

checkOutBtn.addEventListener("click",()=>{
    saveCheckOut(`${hour}:${minute}`);
});

checkInBtn.addEventListener("click",()=>{
  saveCheckIn();
});


async function saveTimeHandler(){
  totalCurrentMinutesLeft = (currentHoursLeft*60)+currentMinutesLeft;
  if(totalCurrentMinutesLeft>(480+30) && totalCurrentMinutesLeft<(600+30)){  //8h*60 = 480min + 30min lunch break   10*60=600h +30min
    savedTimeInMinutes = totalCurrentMinutesLeft - (480+30);
  }
  else{
    savedTimeInMinutes = 0;
  }

  await chrome.storage.local.set({ 
      extraTime:savedTimeInMinutes
    });
}

async function saveCheckIn(){
    startTime = document.getElementById("timeTxt").value;
    endTime="00:00"
    await chrome.storage.local.set({ 
      [dayIndex[day]] : [startTime, endTime],
      todayStartTime: startTime,
      todayEndTime:endTime
    });
    
    savedTimeInMinutes = 0;
} 

async function saveCheckOut(end="00:00"){
  endTime = end;
  await chrome.storage.local.set({ 
      todayEndTime: endTime
  });

  bufferTime = bufferTime + savedTimeInMinutes;

  await chrome.storage.local.set({ 
      lastBufferTime:bufferTime
  });
  // updateBufferTime();
}





function updateClock(){
    var now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();
    second = now.getSeconds();
    day = now.getDay();
    statusCheckIn.innerText = `${startTime} AM`;
    statusCheckOut.innerText = `${endTime} PM`;
    statusExtraTime.innerText = `${savedTimeInMinutes} min`;
    statusBufferTime.innerText = `${bufferTime} min`;

    if(popupTime){
      popupTime.textContent=`${(hour>=0 && hour<=9)?"0"+hour : hour}:${(minute>=0 && minute<=9)?"0"+minute : minute}:${(second>=0 && second<=9)?"0"+second : second}`;
      document.getElementById('popup-date').textContent=`${dayIndex[day]}`;
    }
}

// (function () {
//   setInterval(()=>{
//     updateClock();
//     saveTimeHandler();
//     updateCurrentTimeProgressBar();
//   },1000)

//   getStorageData();
//   initLastBufferTime();
// })();

async function init(){
  const result = await chrome.storage.local.get({
    todayStartTime: "00:00",
    todayEndTime: "00:00",
    extraTime: 0,
    lastBufferTime: 0
  });

  startTime = result.todayStartTime;
  endTime = result.todayEndTime;
  savedTimeInMinutes = result.extraTime;
  bufferTime = result.lastBufferTime;
  
  // updateClock();
  // updateCurrentTimeProgressBar();
  // saveTimeHandler();
}

async function getStorageData(){
   const result = await chrome.storage.local.get({todayStartTime:"00:00", todayEndTime:"00:00", extraTime:0});
   startTime = result.todayStartTime;
   endTime = result.todayEndTime;
   savedTimeInMinutes = result.extraTime;
}

function getDifferenceOfTime(startTime, endTime=`${hour}:${minute}`){
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  // Convert both times completely into total minutes
  const startTotalMinutes = (startHours * 60) + startMinutes;
  const endTotalMinutes = (endHours * 60) + endMinutes;

  // Calculate the difference in minutes
  let differenceInMinutes = endTotalMinutes - startTotalMinutes;

  // Handle cases where the end time is on the next day (e.g., 23:00 to 01:00)
  if (differenceInMinutes < 0) {
    differenceInMinutes += 24 * 60; 
  }

  // Break the total minutes back down into hours and minutes
  const hoursLeft = Math.floor(differenceInMinutes / 60);
  const minutesLeft = differenceInMinutes % 60;
  currentHoursLeft = hoursLeft;
  currentMinutesLeft = minutesLeft;
}


function updateCurrentTimeProgressBar(){
  getDifferenceOfTime(startTime);
  showHoursLeft = (currentHoursLeft / 8) * 100;
  showTotalMinutesLeft = (currentHoursLeft*60)+currentMinutesLeft;
  showMinutesRatio = (showTotalMinutesLeft/(480+30))*100;  //30min lunch break
  document.getElementById(`${dayIndex[day]}`).value = showMinutesRatio;
  document.getElementById(`${dayIndex[day]}`).title = `${Math.floor(showMinutesRatio)}%`;
}

init();

document.addEventListener('DOMContentLoaded', () => {
  
  setInterval(() => {
    updateClock();
    updateCurrentTimeProgressBar();
    saveTimeHandler();    
  }, 1000);
})