const robot = document.getElementById("robot");
const menu = document.getElementById("robotMenu");
const slides = document.querySelectorAll(".slide");
const flood = document.getElementById("flood");

/* ---------------- drag ---------------- */
let isDragging = false, offsetX, offsetY;

robot.addEventListener("pointerdown", e=>{
  isDragging = true;
  offsetX = e.clientX - robot.offsetLeft;
  offsetY = e.clientY - robot.offsetTop;
  robot.style.cursor = "grabbing";
});

document.addEventListener("pointermove", e=>{
  if(!isDragging) return;
  robot.style.left = (e.clientX - offsetX) + "px";
  robot.style.top = (e.clientY - offsetY) + "px";
  robot.style.right = "auto";
});

document.addEventListener("pointerup", ()=>{
  isDragging = false;
  robot.style.cursor = "grab";
});

/* ---------------- click center ---------------- */
robot.addEventListener("click", ()=>{
  robot.classList.add("center");
  document.getElementById("blurOverlay").style.opacity = "1";
  menu.style.display = "flex";
});

/* close when clicking outside */
document.addEventListener("click", (e)=>{
  if(!robot.contains(e.target) && !menu.contains(e.target)){
    robot.classList.remove("center");
    document.getElementById("blurOverlay").style.opacity = "0";
    menu.style.display = "none";
  }
});

/* ---------------- flood effect ---------------- */
menu.querySelectorAll("button").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    startFlood(btn.dataset.effect);
  });
});

document.getElementById("startBtn").addEventListener("click", ()=>{
  document.getElementById("slide2").scrollIntoView({
    behavior: "smooth"
  });
});



/*-----water */

document.addEventListener("DOMContentLoaded", function(){

  const understoodBtn = document.getElementById("understoodBtn");
  const slide2 = document.getElementById("slide2");
  const slide3 = document.getElementById("slide3");
  const waterOverlay = document.getElementById("waterOverlay");

  if(understoodBtn){
    understoodBtn.addEventListener("click", function(){

      slide2.classList.add("fadeOutDream");
      waterOverlay.classList.add("active");

      const waterSound = document.getElementById("waterSound");
if(waterSound){
  waterSound.currentTime = 0;
  waterSound.play().catch(err=>console.log(err));
}

      setTimeout(function(){

        if(waterSound){
  waterSound.pause();
  waterSound.currentTime = 0;
}

  waterOverlay.classList.remove("active");

  // scroll to slide 3
  slide3.style.display = "flex";
 slide2.style.display = "none";
  slide3.style.display = "flex";


  slide3.style.opacity = "0";

  setTimeout(()=>{
    slide3.style.transition = "1s ease";
    slide3.style.opacity = "1";
  },50);

},3000);


    });
  }

});


document.addEventListener("DOMContentLoaded", function(){

  // Digital Timer for Slide 3
const currentTimeDisplay = document.getElementById("currentTime");

function updateDigitalClock(){
  const now = new Date();

  // TIME
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2,"0");
  const seconds = now.getSeconds().toString().padStart(2,"0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  // DATE + DAY
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  const date = now.toLocaleDateString("en-IN", options);

  currentTimeDisplay.innerHTML = `
    ${date} <br>
    ${hours}:${minutes}:${seconds} ${ampm}
  `;
}

setInterval(updateDigitalClock, 1000);




updateDigitalClock();

  const addBtn = document.getElementById("addWater");
  const resetBtn = document.getElementById("resetWater");
  const countText = document.getElementById("count");
  const circle = document.getElementById("progressCircle");
  const logList = document.getElementById("logList");

  let count = parseInt(localStorage.getItem("waterCount")) || 0;
  let waterLogs = JSON.parse(localStorage.getItem("waterLogs")) || [];

  if(!localStorage.getItem("savedDate")){
  localStorage.setItem("savedDate", new Date().toDateString());
}

  const goal = 9;
  const glassSize = 250;
  const circumference = 2 * Math.PI * 85;

  let streak = localStorage.getItem("streak")
  ? parseInt(localStorage.getItem("streak"))
  : 0;

let lastCompletedDate = localStorage.getItem("lastCompletedDate")
  ? new Date(localStorage.getItem("lastCompletedDate"))
  : null;

const streakEl = document.getElementById("streak");

function updateStreakDisplay(){
  if(streakEl){
    streakEl.textContent = `🔥 Streak: ${streak} days`;
  }
}

function handleStreak(){
  const today = new Date();
  today.setHours(0,0,0,0);

  if(!lastCompletedDate){
    streak = 1;
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if(lastCompletedDate.getTime() === yesterday.getTime()){
      streak += 1;
    } else if(lastCompletedDate.getTime() !== today.getTime()){
      streak = 1;
    }
  }

  localStorage.setItem("streak", streak);
  localStorage.setItem("lastCompletedDate", today.toISOString());
  lastCompletedDate = today;

  updateStreakDisplay();

  // run midnight check AFTER variables initialized
checkMidnightReset();
setInterval(checkMidnightReset, 30000);
}

  if(circle){
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    
  }
 
   updateProgress();

   // restore logs on refresh
waterLogs.forEach(log => {
  const li = document.createElement("li");
  li.textContent = log;
  logList.appendChild(li);
});

   function checkMidnightReset() {
  const now = new Date();
  const today = now.toDateString();
  const savedDate = localStorage.getItem("savedDate");

  if (savedDate !== today) {
    count = 0;
    localStorage.setItem("waterCount", 0);
    localStorage.setItem("savedDate", today);

    logList.innerHTML = "";


    waterLogs = [];
    localStorage.setItem("waterLogs", JSON.stringify(waterLogs));

    updateProgress();
  }
}
  addBtn.addEventListener("click", ()=>{
    if(count < goal){
      count++;
      localStorage.setItem("waterCount", count);
      updateProgress();
    


      // Log entry
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2,"0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      const totalML = count * glassSize;

      const li = document.createElement("li");
      li.textContent = `${hours}:${minutes} ${ampm} — ${totalML} ml`;
      logList.appendChild(li);

      waterLogs.push(li.textContent);
      localStorage.setItem("waterLogs", JSON.stringify(waterLogs));
      if(count === goal){
      handleStreak();
      showSlide4(); // auto show slide4
}

    }
    
  });

  resetBtn.addEventListener("click", ()=>{
    count = 0;
    localStorage.setItem("waterCount", count);
    updateProgress();
    logList.innerHTML = "";

    waterLogs = [];
    localStorage.setItem("waterLogs", JSON.stringify(waterLogs));
  });

  function updateProgress(){
    countText.textContent = count;

    const percentageText = document.getElementById("percentageText");
const percentValue = Math.round((count / goal) * 100);
if(percentageText){
  percentageText.textContent = percentValue + "%";
}

    if(circle){
      const percent = count / goal;
      const offset = circumference - percent * circumference;
      circle.style.strokeDashoffset = offset;
    }

  }
 
  updateStreakDisplay();
  
});
document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  if(hamburger && sidebar){
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      console.log("Hamburger clicked"); // debug
    });
  }

  
});


//slide 4 
function showSlide4(){
  const slide4 = document.getElementById("slide4");
  slide4.style.display = "flex"; // show slide
  setTimeout(()=> slide4.style.opacity = 1, 50); // fade in

  // Typing animation
  const typingText = document.getElementById("typingText");
  const message = "You're Cool";
  let i = 0;

  function typeWriter(){
    if(i < message.length){
      typingText.textContent += message.charAt(i);
      i++;
      setTimeout(typeWriter, 150);
    } else {
      startIceEffect();
    }
  }
  typeWriter();
}
function startIceEffect(){
  const ice = document.getElementById("iceEffect");
  const slide4 = document.getElementById("slide4");
  const slide5 = document.getElementById("slide5");

  let size = 0;

  function growIce(){
    if(size < window.innerWidth * 2){
      size += 8;
      ice.style.width = size + "px";
      ice.style.height = size + "px";
      ice.style.top = "50%";
      ice.style.left = "50%";
      ice.style.transform = "translate(-50%, -50%)";
      ice.style.background = "#add8e6";

      requestAnimationFrame(growIce);
    } else {

      // remove movement listeners
      document.removeEventListener("mousemove", growIce);
      document.removeEventListener("touchmove", growIce);

      // fade out slide4
      slide4.style.opacity = "0";

      setTimeout(()=>{
        slide4.style.display = "none";

        // show slide5
        setTimeout(()=>{
       slide4.style.display = "none";
      showSlide5();
      },1000);

      },1000);
    }
  }

  document.addEventListener("mousemove", growIce);
  document.addEventListener("touchmove", growIce);
}

function showSlide5(){
  const slide5 = document.getElementById("slide5");

  slide5.style.display = "flex";
  setTimeout(()=> slide5.style.opacity = 1, 50);

  const wrapper = slide5.querySelector(".hug-wrapper");
  const fillLeft = slide5.querySelector(".fill-left");
  const fillRight = slide5.querySelector(".fill-right");
  

  let holdInterval;
  let progress = 0;
  let isComplete = false;

  

  function startHold(){
    holdInterval = setInterval(()=>{
      progress += 2;

      fillLeft.style.width = progress/2 + "%";
      fillRight.style.width = progress/2 + "%";

      if(progress >= 100){
        clearInterval(holdInterval);
        isComplete = true;

         progress = 100;
        fillLeft.style.width = "50%";
        fillRight.style.width = "50%";

        const heart = slide5.querySelector(".heart-circle");

        heart.style.color = "#e96a79";  // make heart pink
        const nextText = slide5.querySelector("#nextText");
        nextText.classList.add("show");


      }
    },30);
  }

  function cancelHold(){
    if(isComplete) return;  // stop reset if done
    clearInterval(holdInterval);
    progress = 0;
    fillLeft.style.width = "0%";
    fillRight.style.width = "0%";
  }

  wrapper.addEventListener("mousedown", startHold);
  wrapper.addEventListener("mouseup", cancelHold);
  wrapper.addEventListener("mouseleave", cancelHold);

  wrapper.addEventListener("touchstart", startHold);
  wrapper.addEventListener("touchend", cancelHold);
}


document.addEventListener("DOMContentLoaded", function(){

  const clickSound = new Audio('click.mp3');
  clickSound.preload = "auto";

  document.addEventListener("click", function(e){
    if(e.target.tagName === "BUTTON"){
      clickSound.currentTime = 0;
      clickSound.play().catch(err => console.log(err));
    }
  });

});
