'use strict';
(function(){

    function Start()
    {
        console.log("Search controls added...");
        
        let listItems = document.getElementsByTagName('td');
        
        console.log(listItems);
        for(let a of listItems)
        {
            a.addEventListener('click', showView);
        }
        
    }
    window.addEventListener("load", Start);
})();

function showView()
{
    console.log('working');
}