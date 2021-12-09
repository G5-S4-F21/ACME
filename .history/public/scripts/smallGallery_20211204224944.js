//The conatiner level -1 which contains the image slider...
var images_container_Lv_minus1 = document.getElementById('container_Lv_minus1');
//The conatiner level 0 which contains the image slider...
var images_container_Lv0 = document.getElementById('container_Lv0');


function Make_Img_Slider(array_of_images) {

    let images_container_Lv1 = document.createElement('div');
    images_container_Lv1.id = 'container_Lv1';
    images_container_Lv0.appendChild(images_container_Lv1);

    let next_Btn = document.createElement('div');
    next_Btn.id = 'next_Btn_div';
    next_Btn.innerHTML = '<svg id="next_Btn" stroke="#1D2026" width="13" height="18" xmlns="http://www.w3.org/2000/svg"><path d="m2 1 8 8-8 8" stroke-width="3" fill="none" fill-rule="evenodd"/></svg>';
    images_container_Lv0.appendChild(next_Btn);

    let prev_Btn = document.createElement('div');
    prev_Btn.id = 'prev_Btn_div';
    prev_Btn.innerHTML = '<svg id="prev_Btn" stroke="#1D2026" width="12" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M11 1 3 9l8 8" stroke-width="3" fill="none" fill-rule="evenodd"/></svg>';
    images_container_Lv0.appendChild(prev_Btn);

    let radio_Btns_container = document.createElement('div');
    radio_Btns_container.id = 'radio_Btns_container';
    images_container_Lv0.appendChild(radio_Btns_container);




    let images_array = array_of_images;

    images_container_Lv0.classList.remove('hidden');
    images_container_Lv_minus1.classList.remove('hidden');

    //Counter to make the image slider move... Starts at 1 so that the first image shown is not the clone one...
    let counter = 1; 


    //Placing the last image's clone at starting to smoothen out the transition....
    let container_Lv2 = document.createElement('div');
    container_Lv2.classList.add('container_Lv2');
    images_container_Lv1.appendChild(container_Lv2);
    let image_temp = new Image();
    image_temp.src = images_array[images_array.length-1];
    container_Lv2.appendChild(image_temp);
    //Placing all the other images...
    for (let i = 0; i < images_array.length; i++) {

        let image_temp = new Image();
        image_temp.src = images_array[i];
        let container_Lv2 = document.createElement('div');
        container_Lv2.classList.add('container_Lv2');
        images_container_Lv1.appendChild(container_Lv2);
        container_Lv2.appendChild(image_temp);
    }
    //Placing the first image's clone at last to smoothen out the transition....
    let container_Lv2_2 = document.createElement('div');
    container_Lv2_2.classList.add('container_Lv2');
    images_container_Lv1.appendChild(container_Lv2_2);
    let image_temp2 = new Image();
    image_temp2.src = images_array[0];
    container_Lv2_2.appendChild(image_temp2);



    //Making radio buttons numbers and styling
    radio_Btns_container.classList.add('invisible');
    for (let i = 0; i < images_array.length; i++) {
        
        let radio_Btn_div = document.createElement('span');
        radio_Btn_div.classList.add('radio_Btn_div');
        radio_Btn_div.innerHTML = '<svg class="radio_Btn" fill="hsl(0, 0%, 45%)" xmlns="http://www.w3.org/2000/svg" width="15" height="15" version="1.1"><circle cx="7.5" cy="7.5" r="7.5" ></circle></svg>';

        radio_Btns_container.appendChild(radio_Btn_div);
    }
    images_container_Lv1.style.transform = 'translateX(-' + (35*counter) + 'em)'
    //Slecting the radio buttons with class radio_Btn with query selector all so that I can make their color diff with indexing...
    var radio_Btn_es = document.querySelectorAll('.radio_Btn'); 
    radio_Btn_es[0].style.fill = 'tomato';




    // Making radio buttons and nex and prev show up when mouse enters the image slider and making them invisible when mouse enters...
    images_container_Lv0.addEventListener('mouseenter' , ()=>{
        radio_Btns_container.classList.remove('invisible');
        next_Btn.classList.remove('invisible');
        prev_Btn.classList.remove('invisible');
    });
    images_container_Lv0.addEventListener('mouseleave' , ()=>{
        radio_Btns_container.classList.add('invisible');
        next_Btn.classList.add('invisible');
        prev_Btn.classList.add('invisible');
    });

    //Adding eventlistener for click on all radio buttons to enable them navigate through the images...￼
    for (let i = 0; i < radio_Btn_es.length; i++) {
        radio_Btn_es[i].addEventListener('click',()=>{
            images_container_Lv1.style.transition = 'none';
            counter = i + 1;
            images_container_Lv1.style.transform = 'translateX(-' + (35*counter) + 'em)';

            for (let i = 0; i < radio_Btn_es.length; i++) {
                radio_Btn_es[i].style.fill = 'hsl(0, 0%, 45%)';
            }

            radio_Btn_es[i].style.transition = 'fill 0.4s ease-in-out';
            radio_Btn_es[i].style.fill = 'tomato';
        });
    }


    next_Btn.addEventListener('click',()=>{
        if (counter < images_array.length+1){
            images_container_Lv1.style.transition = 'transform 0.6s ease-in-out';
            counter++;
            images_container_Lv1.style.transform = 'translateX(-' + (35*counter) + 'em)';

            for (let i = 0; i < radio_Btn_es.length; i++) {
                radio_Btn_es[i].style.fill = 'hsl(0, 0%, 45%)';
            }


            if (radio_Btn_es.length == counter - 1) {
                radio_Btn_es[0].style.transition = 'fill 0.4s ease-in-out';
                radio_Btn_es[0].style.fill = 'tomato';     
            }else{
                radio_Btn_es[counter-1].style.transition = 'fill 0.4s ease-in-out';
                radio_Btn_es[counter-1].style.fill = 'tomato';
            }
        }
    })
    prev_Btn.addEventListener('click',()=>{
        if (counter > 0){
            images_container_Lv1.style.transition = 'transform 0.6s ease-in-out';
            counter--;
            images_container_Lv1.style.transform = 'translateX(-' + (35*counter) + 'em)'

            for (let i = 0; i < radio_Btn_es.length; i++) {
                radio_Btn_es[i].style.fill = 'hsl(0, 0%, 45%)';
            }

            if (counter == 0) {
                radio_Btn_es[radio_Btn_es.length-1].style.transition = 'fill 0.4s ease-in-out';
                radio_Btn_es[radio_Btn_es.length-1].style.fill = 'tomato';     
            }else{
                radio_Btn_es[counter-1].style.transition = 'fill 0.4s ease-in-out';
                radio_Btn_es[counter-1].style.fill = 'tomato';
            }
        }
    })

    next_Btn.addEventListener('mouseenter',()=>{
        var style = document.createElement('style');
        style.innerHTML = `
        #next_Btn_div svg {
            stroke: tomato;
        }
        `;
        document.head.appendChild(style);
    })
    next_Btn.addEventListener('mouseleave',()=>{
        var style = document.createElement('style');
        style.innerHTML = `
        #next_Btn_div svg {
            stroke: #1D2026;
        }
        `;
        document.head.appendChild(style);
    })

    prev_Btn.addEventListener('mouseenter',()=>{
        var style = document.createElement('style');
        style.innerHTML = `
        #prev_Btn_div svg {
            stroke: tomato;
        }
        `;
        document.head.appendChild(style);
    })
    prev_Btn.addEventListener('mouseleave',()=>{
        var style = document.createElement('style');
        style.innerHTML = `
        #prev_Btn_div svg {
            stroke: #1D2026;
        }
        `;
        document.head.appendChild(style);
    })


    images_container_Lv1.addEventListener('transitionend', ()=>{

        if (counter == images_array.length+1) {
            images_container_Lv1.style.transition = 'none';
            counter = 1;
            images_container_Lv1.style.transform = 'translateX(-' + (35*counter) + 'em)';

        }else if (counter == 0) {
            images_container_Lv1.style.transition = 'none';
            counter = images_array.length;
            images_container_Lv1.style.transform = 'translateX(-' + (35*counter) + 'em)';
        }
    });




//This commented code is thee to make image slider go way when clicked outside of tjhe images_container_Lv0..
    // document.addEventListener("mouseup", function(event) {
    //     var obj = images_container_Lv0;
    //     if (!obj.contains(event.target)) {
    //         images_container_Lv0.classList.add('hidden');
    //         images_container_Lv_minus1.classList.add('hidden');
    //         images_container_Lv1.innerHTML = '';
    //         radio_Btns_container.innerHTML = '';


    //         // *******************************************************************************************************
    //         // *******************************************************************************************************
    //         //Removing all the event listeners... By replacing their functions by EmptyFunction() which does nothing..


    //         // Making radio buttons and nex and prev show up when mouse enters the image slider and making them invisible when mouse enters...
    //         images_container_Lv0.addEventListener('mouseenter' , EmptyFunction);
    //         images_container_Lv0.addEventListener('mouseleave' , EmptyFunction);

    //         //Adding eventlistener for click on all radio buttons to enable them navigate through the images...￼
    //         for (let i = 0; i < radio_Btn_es.length; i++) {
    //             radio_Btn_es[i].addEventListener('click',EmptyFunction);
    //         }


    //         next_Btn.addEventListener('click',EmptyFunction)
    //         prev_Btn.addEventListener('click',EmptyFunction)

    //         next_Btn.addEventListener('mouseenter',EmptyFunction)
    //         next_Btn.addEventListener('mouseleave',EmptyFunction)

    //         prev_Btn.addEventListener('mouseenter',EmptyFunction)
    //         prev_Btn.addEventListener('mouseleave',EmptyFunction)


    //         images_container_Lv1.addEventListener('transitionend', EmptyFunction);
    //         images_array = [];



    //         images_container_Lv1.remove()
    //         next_Btn.remove()
    //         prev_Btn.remove()
    //         radio_Btns_container.remove()

    //     }
    // });
}


function EmptyFunction() {
    console.log('Empty_Function..');
}



//******************************************************************************************************************************************************
//This is where you put your images...

Make_Img_Slider([
  'https://images.unsplash.com/photo-1571225295040-895f2e00eb5a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80',
  'https://images.unsplash.com/photo-1637093254890-8ac2caf5f07c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1032&q=80',
  'https://images.unsplash.com/photo-1637100958930-f89e3564d491?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80',
  'https://images.unsplash.com/photo-1637097059267-40681bdae8ae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80',
  'https://images.unsplash.com/photo-1636926587706-6ef4bf952e3b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=406&q=80',
  'https://images.unsplash.com/photo-1637141388161-9b905311ac04?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1031&q=80',
  'https://images.unsplash.com/photo-1637140945341-f28ada987326?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=435&q=80' 
])



