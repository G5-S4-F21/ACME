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



        let days = document.getElementsByTagName('td');
        let elle = document.getElementById('apptList');
        let ApptList = elle.getAttribute("value");
        console.log(elle);
        let jsonList = JSON.parse(ApptList);
           
        let match = false;
        for(let element of days)
        {
            for(let a in jsonList)
            {
                if(jsonList[a].ApptSeeker == '')
                {
                    if(jsonList[a].ApptDate == element.getAttribute('data-day'))
                    {
                        element.style.borderColor = 'Chartreuse';
                    }
                }
                else
                {
                    if(jsonList[a].ApptDate == element.getAttribute('data-day'))
                    {
                        element.style.borderColor = 'DarkRed';
                    }
                }
            }

            element.addEventListener("click", (event) => {
                //retreive the date and add to the url then send
                let setterDate = (element.getAttribute("data-day"));
                //pass the calendar date to the form below
                let dateStr = document.getElementById('apptDate');
                dateStr.setAttribute('value', setterDate);
                //add in extra stuff that will pass the data to other calendar
                let match = false;
                let selectedDay = element.getAttribute('data-day');
                let dayTitle = document.getElementById('dayTitle');
                dayTitle.innerHTML = selectedDay;
                //clear the list of tags in 
                let togo = document.getElementById('daily');
                if(togo != null)
                {
                    togo.remove();
                }
                let daily = document.createElement('div');
                let dailyList = document.getElementById('dailyList');
                daily.setAttribute('id', 'daily');
                dailyList.appendChild(daily);
                for(let a in jsonList)
                {
                    if(selectedDay == jsonList[a].ApptDate)
                    {
                        let mainDaily = document.getElementById('daily');
                        let form = document.createElement('form');
                        form.setAttribute('method', 'POST');
                        form.setAttribute('action', 'schedule');
                        form.setAttribute('class', 'card-body d-flex');
                        form.setAttribute('id','virtualForm');
                        //add in the control here
                        mainDaily.appendChild(form);
                        let div1 = document.createElement('div');
                        div1.setAttribute('class', 'container');
                        form.appendChild(div1);
                        let h61 = document.createElement('h6');
                        div1.appendChild(h61);
                        h61.innerHTML = jsonList[a].ApptDate;
                        let hInput = document.createElement('input');
                        hInput.setAttribute('type', 'hidden');
                        hInput.setAttribute('name', 'dateLookup');
                        hInput.setAttribute('id', 'dateLookup');
                        //hInput.setAttribute('class', 'btn btn-secondary');
                        hInput.setAttribute('value', jsonList[a]._id);
                        div1.appendChild(hInput);
                        let div2 = document.createElement('div');
                        div2.setAttribute('class', 'container');
                        div1.appendChild(div2);
                        let br = document.createElement('br');
                        div2.appendChild(br);
                        //let sub = document.createElement('input');
                        //sub.setAttribute('type', 'submit');
                        //sub.setAttribute('class', 'btn btn-secondary');
                        //div2.appendChild(sub);
                        
                        let div3 = document.createElement('div');
                        div3.setAttribute('class', 'container');
                        let list = document.createElement('dl');
                        let dt1 = document.createElement('dt');
                        dt1.setAttribute('id', 'dayCalLoc');
                        dt1.innerHTML = "Location: " + jsonList[a].ApptLoc;
                        list.appendChild(dt1);
                        let dt2 = document.createElement('dt');
                        dt2.innerHTML = "Trainer: " + jsonList[a].ApptTrainer;
                        list.appendChild(dt2);
                        let dt3 = document.createElement('dt');
                        dt3.innerHTML = "Time: " + jsonList[a].ApptTime;
                        list.appendChild(dt3);
                        let dt4 = document.createElement('dt');
                        if(jsonList[a].ApptSeeker == '')
                        {
                            dt4.setAttribute('class', 'text-danger');
                            dt4.innerHTML = "Seeker: vacant";
                        }
                        else
                        {
                            dt4.setAttribute('class', 'text-dark');
                            dt4.innerHTML = "Seeker: " + jsonList[a].ApptSeeker;
                        }
                        list.appendChild(dt4);
                        div3.appendChild(list);
                        form.appendChild(div3);
                        let line = document.createElement('hr');
                        form.appendChild(line);
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

function incCalendar()
{
    let center = document.getElementById("onethree");
    //console.log(center);
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

