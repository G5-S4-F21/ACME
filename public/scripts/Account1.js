'use strict';
(function(){

    function Start()
    {
        console.log('adding actions...');

        let notSecret = document.getElementById('ext');
        notSecret.addEventListener('click', navPublic);
        let secret = document.getElementById('sec');
        secret.addEventListener('click', navSecret);
    }
    window.addEventListener('load', Start);
})();


function navPublic()
{
    location.href='/seeker/notSecret';
}

function navSecret()
{
    location.href='/seeker/secret';
}