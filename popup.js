var dayIndex = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];
var day=0;



async function saveCheckIn(){
    await chrome.storage.local.set({ 
      [dayIndex[day]] : [document.getElementById("timeTxt").value, 0]
    });
  console.log(document.getElementById("timeTxt").value);
} 

document.getElementById("setCheckInbtn").addEventListener("click",()=>{
  saveCheckIn();
});

(function () {
  // let is12Hour = false;

  // // ── Load Saved Preferences ──────────────────────────────────────
  // chrome.storage.local.get(["sms_clock_format", "sms_clock_pos"], (result) => {
  //   if (result.sms_clock_format) {
  //     is12Hour = result.sms_clock_format === "12h";
  //     updateFormatButtons();
  //   }
  //   if (result.sms_clock_pos) {
  //     document.getElementById("status-position").textContent =
  //       "X:" + result.sms_clock_pos.x + " Y:" + result.sms_clock_pos.y;
  //   }
  // });

  // // ── Live Clock ──────────────────────────────────────────────────
  // function updateClock() {
  //   const now = new Date();

  //   let hours  = now.getHours();
  //   const mins = String(now.getMinutes()).padStart(2, "0");
  //   const secs = String(now.getSeconds()).padStart(2, "0");
  //   let suffix = "";

  //   if (is12Hour) {
  //     suffix = hours >= 12 ? " PM" : " AM";
  //     hours  = hours % 12 || 12;
  //   }

  //   document.getElementById("popup-time").textContent =
  //     String(hours).padStart(2, "0") + ":" + mins + ":" + secs + suffix;

  //   const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  //   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  //   document.getElementById("popup-date").textContent =
  //     days[now.getDay()] + ", " +
  //     String(now.getDate()).padStart(2, "0") + " " +
  //     months[now.getMonth()] + " " +
  //     now.getFullYear();

  //   document.getElementById("popup-timezone").textContent =
  //     Intl.DateTimeFormat().resolvedOptions().timeZone;
  // }

  // updateClock();
  // setInterval(updateClock, 1000);

  // // ── Format Toggle Buttons ───────────────────────────────────────
  // function updateFormatButtons() {
  //   const btn24 = document.getElementById("btn-24h");
  //   const btn12 = document.getElementById("btn-12h");
  //   const statusFormat = document.getElementById("status-format");

  //   if (is12Hour) {
  //     btn12.className = "btn btn-active";
  //     btn24.className = "btn btn-secondary";
  //     statusFormat.textContent = "12H";
  //   } else {
  //     btn24.className = "btn btn-active";
  //     btn12.className = "btn btn-secondary";
  //     statusFormat.textContent = "24H";
  //   }
  // }

  // document.getElementById("btn-24h").addEventListener("click", () => {
  //   is12Hour = false;
  //   chrome.storage.local.set({ sms_clock_format: "24h" });
  //   updateFormatButtons();
  //   updateClock();
  // });

  // document.getElementById("btn-12h").addEventListener("click", () => {
  //   is12Hour = true;
  //   chrome.storage.local.set({ sms_clock_format: "12h" });
  //   updateFormatButtons();
  //   updateClock();
  // });
 
  function updateClock(){
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    day = now.getDay();
    var popupTime = document.getElementById('popup-time');
    
    if(popupTime){
      popupTime.textContent=`${(hour>=0 && hour<=9)?"0"+hour : hour}:${(minute>=0 && minute<=9)?"0"+minute : minute}:${(second>=0 && second<=9)?"0"+second : second}`;
      document.getElementById('popup-date').textContent=`${dayIndex[day]}`;
    }
  }

  setInterval(()=>{
    updateClock()
  },1000)
  
  
})();