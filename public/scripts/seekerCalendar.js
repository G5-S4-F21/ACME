'use strict';
(function(){

    function Start()
    {
        console.log("Calendar controls added...");
        initializeCalender();

        let cheveronRight = document.getElementById("right");
        cheveronRight.addEventListener('click', incCalendar);
        let cheveronLeft = document.getElementById("left");
        cheveronLeft.addEventListener('click', decCalendar);
        
        //change the color of the day with appts
        let days = document.getElementsByTagName('td');
        
        let match = false;
        for(let element of days)
        {
            let elle = document.getElementById('apptList');
            //console.log(elle);
            let ApptList = elle.getAttribute("value");
            let jsonList = JSON.parse(ApptList);
            for(let a in jsonList)
            {
                if(jsonList[a].ApptDate == element.getAttribute('data-day'))
                {
                    element.style.borderColor = 'DarkRed';
                }
            }
            element.addEventListener("click", (event) => {
                //retreive the date and add to the url then send
                let setterDate = (element.getAttribute("data-day"));
                //we want to present button for doing stuff
                let dateStr = document.getElementById('apptDate');
                dateStr.setAttribute('value', setterDate);
                //add in extra stuff that will pass the data to other calendar
                let match = false;
                //console.log(days);
                for(let element of days)
                {
                    for(let a in jsonList)
                    {
                        //console.log(jsonList[a]);
                        //console.log(element.getAttribute('data-day'));
                        if(jsonList[a].ApptDate == element.getAttribute('data-day'))
                        {
                            let dayCalDate = document.getElementById('dayCalDate');
                            dayCalDate.innerHTML = jsonList[a].ApptDate;
                            let dayLookup = document.getElementById('dateLookup');
                            dayLookup.setAttribute('value', jsonList[a]._id);
                            console.log(jsonList[a]._id);
                            let dayCalSeek = document.getElementById('dayCalSeek');
                            dayCalSeek.innerHTML = jsonList[a].ApptTrainer; 
                            let dayCalTime = document.getElementById('dayCalTime');
                            dayCalTime.innerHTML = jsonList[a].ApptTime; 
                            let dayCalLoc = document.getElementById('dayCalLoc');
                            dayCalLoc.innerHTML = jsonList[a].ApptLoc;  
                            //console.log(dayCalLoc);
                        }
                    }
                }
            });
            element.addEventListener("mouseover", (event) => {
                element.style.backgroundColor = "DeepSkyBlue";
            });
            element.addEventListener("mouseleave", (event) => {
                element.style.backgroundColor = "white";
            });
        }
    }
    window.addEventListener("load", Start);
})();

function incCalendar()
{
    let center = document.getElementById("onethree");
    console.log(center);
    let pCenter = center.getAttribute('data-day').split('/');
    let thisMonth = new Date(pCenter[2], pCenter[0]-1, pCenter[1], 0, 0, 0, 0);
    let nextMonth = new Date(thisMonth.setMonth(thisMonth.getMonth()+1));
    let monthTitle = document.getElementById('MonthName');
    monthTitle.innerHTML = (nextMonth.toLocaleDateString("en-us", { month: "long"}) + " " + nextMonth.getFullYear());
    nextMonth.setDate(1);
    let dayName = nextMonth.toLocaleDateString("en-us", { weekday: "long"});
    let days = document.getElementsByTagName('td');
    
    let trigger = false;
    for(let d of days)
    {
        d.innerHTML = null;
        if(trigger == false)
        {
            if(!(d.getAttribute('id').localeCompare(dayName)))
            {
                d.innerHTML = nextMonth.getDate();
                let dd = String(nextMonth.getDate()).padStart(2, '0');
                let mm = String(nextMonth.getMonth() + 1).padStart(2, '0');
                let yyyy = nextMonth.getFullYear();
                let dateStr = mm + "/" + dd + "/" + yyyy;
                d.setAttribute("data-day", dateStr);
                nextMonth.setDate(nextMonth.getDate() + 1);
                trigger = true;
            }
        }
        else
        {
            d.innerHTML = nextMonth.getDate();
            let dd = String(nextMonth.getDate()).padStart(2, '0');
            let mm = String(nextMonth.getMonth() + 1).padStart(2, '0');
            let yyyy = nextMonth.getFullYear();
            let dateStr = mm + "/" + dd + "/" + yyyy;
            d.setAttribute("data-day", dateStr);
            nextMonth.setDate(nextMonth.getDate() + 1);
        }
    }                   
}

function compareDates(iter, s2){
    let datestr = iter.split(",")[3];
    let data = datestr.split(':');
    let subdata = data[1].replace(/['"]+/g, '');
    //console.log(subdata + ' ' + '11/09/2021');
    let date1 = new Date(subdata);
    let date2 = new Date(s2);
    //console.log(data[1]);
    if(date1 = date2)
    {
        return true;
    }
    return false;
}

function decCalendar()
{
    let center = document.getElementById("onethree");
    let pCenter = center.getAttribute('data-day').split('/');
    let thisMonth = new Date(pCenter[2], pCenter[0]-1, pCenter[1], 0, 0, 0, 0);
    let prevMonth = new Date(thisMonth.setMonth(thisMonth.getMonth()-1));
    let monthTitle = document.getElementById('MonthName');
    monthTitle.innerHTML = (prevMonth.toLocaleDateString("en-us", { month: "long"}) + " " + prevMonth.getFullYear());
    prevMonth.setDate(1);
    let dayName = prevMonth.toLocaleDateString("en-us", { weekday: "long"});
    let days = document.getElementsByTagName('td');
          
    let trigger = false;
    for(let d of days)
    {
        d.innerHTML = null;
        if(trigger == false)
        {
            if(!(d.getAttribute('id').localeCompare(dayName)))
            {
                d.innerHTML = prevMonth.getDate();
                let dd = String(prevMonth.getDate()).padStart(2, '0');
                let mm = String(prevMonth.getMonth() + 1).padStart(2, '0'); //Jan. is 0
                let yyyy = prevMonth.getFullYear();
                let dateStr = mm + "/" + dd + "/" + yyyy;
                d.setAttribute("data-day", dateStr);
                prevMonth.setDate(prevMonth.getDate() + 1);
                trigger = true;
            }
        }
        else
        {
            d.innerHTML = prevMonth.getDate();
            let dd = String(prevMonth.getDate()).padStart(2, '0');
            let mm = String(prevMonth.getMonth() + 1).padStart(2, '0'); //Jan. is 0
            let yyyy = prevMonth.getFullYear();
            let dateStr = mm + "/" + dd + "/" + yyyy;
            d.setAttribute("data-day", dateStr);
            prevMonth.setDate(prevMonth.getDate() + 1);
        }
    }
}

function initializeCalender()
{
    console.log("calendar intilization");

    let month = document.getElementById("MonthName");
    //find the current date
    let today = new Date();
    today.setDate(1);
    //set name of month in title
    month.innerHTML = (today.toLocaleDateString("en-us", { month: "long"}) + " " + today.getFullYear());
    let startDay = today.getDay();
    let dayName = 'noDay';
    switch (startDay){
        case 1:
            dayName = 'Monday';
            break;
        case 2:
            dayName = 'Tuesday';
            break;
        case 3:
            dayName = 'Wednesday';
            break;
        case 4:
            dayName = 'Thursday';
            break;
        case 5:
            dayName = 'Friday';
            break;
        case 6:
            dayName = 'Saturday';
            break;
        case 7:
            dayName = 'Sunday';
            break;
        default:
            break
    }
    let days = document.getElementsByTagName('td');
    let trig = false;
    for(let d of days)
    {
        d.innerHTML = null;
        if((d.getAttribute('id') === dayName))
        {
            trig = true;
        }
        if(trig)
        {
            let slash = today.getMonth() + 1;
            slash += '/';
            slash += today.getDate();
            slash += '/';
            slash += today.getFullYear();
            d.setAttribute('data-day', slash);
            d.innerHTML = today.getDate();
            today.setDate(today.getDate() + 1);
        }
    }
}