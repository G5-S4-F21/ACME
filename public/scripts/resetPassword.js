
$('#reset_button').click(()=>{
    const new_password=$('#new_password').val()
    const confirm_new_password=$('#confirm_new_password').val()
    const account_type=$('#account_type').val().replace(' ', '')
    const UUID=$('#UUID').val()

    // validation
    if(new_password.trim()==='' || confirm_new_password.trim()===''){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all fields',
        })
        return
    }else if(new_password.trim()!==confirm_new_password.trim()){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Two passwords are not same, please try again',
        })
        return
    }

    const userInfo={
        new_password,
        confirm_new_password,
        account_type,
        UUID
    }
    console.log(userInfo)

    // send AJAX to reset password
    $.ajax({
        type:'POST',
        url:'resetPassword',
        data:userInfo,
        success:(data)=>{
            if(data==='-2'){
                // server error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong, please try again later',
                })
            }else if(data==='0'){
                // no this user
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'User does not exist',
                    footer: '<a href="/createAccount">Create one?</a>'
                })
            }else if(data==='1'){
                // update successfully
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    title: 'Update successfully',
                    text: 'Please login'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        window.location.href='/login'
                    }
                })
            }
        }
    })
})
