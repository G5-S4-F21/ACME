$('#my_schedule').click(()=>{
    const url=$('#my_schedule').attr('data-des')

    $.ajax({
        type:'GET',
        url,
        data:{},
        success:(data)=>{
            if(data==='0'){
                // this trainer does not fill certificate form
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    confirmButtonText: 'Fill info',
                    title: 'Oops...',
                    text: 'You have to fill your certificate before scheduling appointments'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        window.location.href='/trainer/certificate'
                    }
                })
            }else if(data==='1'){
                console.log('goto')
                // this trainer does fill certificate form
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    confirmButtonText: 'Schedule now',
                    title: 'Great',
                    text: 'You are all set!'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        window.location.href='/trainer/doSchedule'
                    }
                })
                // window.location.href='/trainer/schedule'
            }else if(data==='-2'){
                // server error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong, please try again later',
                })
            }
        }
    })
})
