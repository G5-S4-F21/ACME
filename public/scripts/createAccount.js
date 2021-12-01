
let user_email=$('#userEmail').val()
let user_password=$('#userPassword').val()
let user_cellphone_number=$('#userCellphone').val()
let user_account_type=$('#account_type').val()

const userInfo={
    user_email,
    user_password,
    user_cellphone_number
}


$('#submit_button').click(() => {
    let user_email=$('#userEmail').val()
    let user_password=$('#userPassword').val()
    let user_cellphone_number=$('#userCellphone').val()
    let user_account_type=$('input[name="account_type"]:checked').val()


    //validation
    if(!validateField(user_email) || !validateField(user_password) || !validateField(user_cellphone_number)){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all fields',
        })
        return
    }

    const userInfo={
        user_email,
        user_password,
        user_cellphone_number,
        user_account_type
    }

    console.log(userInfo)

    // send ajax
    $.ajax({
        type:'post',
        url:'/createAccount',
        data:userInfo,
        success: (data)=>{
            console.log(data)
            if(data==='0'){
                // registered successfully
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    title: 'Register successfully',
                    text: 'You will go to login page'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        window.location.href='/login'
                    }
                })

            }else if(data==='1'){
                // the email has been registered
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'The email has been registered',
                })
                // clear form
                $('#userEmail').val('')
                $('#userPassword').val('')
                $('#userCellphone').val('')
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong, please try again later',
                    footer: '<a href="/createAccount">Click me to refresh the page</a>'
                })
                // clear form
                $('#userEmail').val('')
                $('#userPassword').val('')
                $('#userCellphone').val('')
            }
        }
    })
})

const validateField=(str)=>{
    if(str.trim()!==''){
        return true
    }
}
