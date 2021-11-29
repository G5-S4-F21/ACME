$('#submit_button').click(()=>{
    const trainer_full_name=$('#trainer_full_name').val()
    const trainer_years_of_training=$('#trainer_years_of_training').val()

    if(trainer_full_name.trim()==='' || trainer_years_of_training.trim()===''){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all fields',
        })
        return
    }
    const userInfo={
        trainer_full_name,
        trainer_years_of_training
    }
    // ajax
    $.ajax({
        type:'POST',
        url:'/trainer/certificate',
        data: userInfo,
        success:(data)=>{
            if(data==='0'){
                // no such trainer
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Trainer does not exist',
                    footer: '<a href="/createAccount">Register one?</a>'
                })
            }else if(data==='1'){
                console.log('refresh')
                // fill certificate successfully
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    title: 'Upload successfully',
                    text: 'You will go to your schedule page'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        window.location.href='/trainer/schedule'
                    }
                })
            }else if(data==='-2'){
                // server error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong, please try again later',
                    footer: '<a href="/createAccount">Click me to refresh the page</a>'
                })
            }
        }
    })
})
