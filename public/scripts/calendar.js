'use strict';
(function(){

    function Start()
    {
        console.log("Calendar controls added...");

        /*let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        console.log(dd);
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //Jan. is 0
        console.log(mm);
        let yyyy = today.getFullYear();
        console.log(yyyy);
        console.log(today);*/

       /* let elle = document.getElementById('apptList');
        //let ApptList = elle.innerHTML;
        let ApptList = elle.getAttribute("value");
        let datestr = ApptList.split(",")[3];
        let data = datestr.split(':');
        let subdata = data[1].replace(/['"]+/g, '');
        console.log(subdata + ' ' + '11/09/2021');
        let date1 = new Date(subdata);
        let date2 = new Date('11/09/2021');
        console.log(date1 + ' ' + date2);
        if(date1 = date2)
        {
            console.log("match");
        }*/
        //console.log(ApptList);
        //perform init of calendar here
        //initializeCalender();
        
        let cheveronRight = document.getElementById("right");
        cheveronRight.addEventListener('click', incCalendar);
        let cheveronLeft = document.getElementById("left");
        cheveronLeft.addEventListener('click', decCalendar);
        
        //change the color of the day with appts
        let days = document.getElementsByTagName('td');
        
        
        //let datestr = iter.split(",")[3];
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
                            let dayCalSeek = document.getElementById('dayCalSeek');
                            dayCalSeek.innerHTML = jsonList[a].ApptSeeker; 
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
        //logCalender();
    }

    window.addEventListener("load", Start);

})();

//build some seperate functions
function changeCalender(){
    console.log("calendar function called");
}

function log(current, index)
{
    console.log(current);
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
function initializeCalender(){
    console.log("calendar intilization");
    let center = document.getElementById("onethree");
    let pCenter = center.getAttribute('data-day').split('/');
    let thisMonth = new Date(pCenter[2], pCenter[0]-1, pCenter[1], 0, 0, 0, 0);
    //retreive the name of the month
    let monthTitle = document.getElementById('MonthName');
    monthTitle.innerHTML = (thisMonth.toLocaleDateString("en-us", { month: "long"}) + " " + thisMonth.getFullYear());
    //set the date of this month to the first
    thisMonth.setDate(1);
    //find the day that the first falls on
    let dayName = thisMonth.toLocaleDateString("en-us", { weekday: "long"});
    let days = document.getElementsByTagName('td');
    //start the day adding process but just add callbacks 
    console.log(days);
    /*let trigger = false;
    for(let d of days)
    {
        d.innerHTML = null;
        if(trigger == false)
        {

        }
    }*/
}

function incCalendar()
{
    let center = document.getElementById("onethree");
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