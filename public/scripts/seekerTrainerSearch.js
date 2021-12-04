'use strict';
(function(){

    function Start()
    {
        console.log("Search controls added...");
        
        let listItems = document.getElementsByTagName('td');
        
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
    //this should be a post
    //window.open().focus();
}