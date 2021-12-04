let user_email=$('#user_email')
let user_password=$('#user_password')
let user_account_type=$('#user_account_type')

$('#login_button').click(()=>{
    let user_email=$('#user_email').val()
    let user_password=$('#user_password').val()
    let user_account_type=$('#user_account_type').val()

    const userInfo={
        user_email,
        user_password,
        user_account_type
    }
    if(user_email==='' || user_password===''){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all fields',
        })
        return
    }

    $.ajax({
        type:'post',
        url:'/login',
        data:userInfo,
        success: (data)=>{
            if(data==='-2'){
                // server error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong, please try again later',
                    // TODO:recover password
                    footer: '<a href="/login">Click me to refresh the page</a>'
                })
            }else if(data==='-1'){
                // email or password is not right
                $('#user_email').val('')
                $('#user_password').val('')
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'email or password is not right',
                })
            }else if(data==='1'){
                // login successfully
                // registered successfully
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    title: 'Login successfully',
                    text: 'You will go to home page'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        if(user_account_type == 'Trainer')
                        {
                            window.location.href='/trainerHome'
                        }
                        else if(user_account_type == 'Trainer Seeker')
                        {
                            window.location.href='/seekerHome'
                        }
                        else if(user_account_type == 'admin')
                        {
                            window.location.href='/adminHome'
                        }
                        else
                        {
                            window.location.href='/'
                        }
                    }
                })
            }
        }
    })
})

// $('#forgetPasswordButton').click(()=>{
//     $.ajax({
//         type:'GET',
//         url:'/forgetPassword',
//         data:{},
//         success:(data)=>{
//             console.log(data)
//         }
//     })
// })
