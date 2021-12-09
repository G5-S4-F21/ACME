<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
$('#send_email_button').click(()=>{
    console.log("KESS");
    const user_email=$('#user_email').val()
    const user_account_type=$('#user_account_type').val()

    if(user_email.trim()===''){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill your email!',
        })
        return
    }

    const userInfo={
        user_email,
        user_account_type
    }
    $('#send_email_button').attr('disabled', 'disabled')

    $.ajax({
        type:'GET',
        url:'/sendRecoverPasswordEmail',
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
                // no such user in DB
                Swal.fire({
                    icon: 'info',
                    title: 'Oops...',
                    text: 'No such user yet!',
                    footer: '<a href="/createAccount">Register now</a>'
                })
            }else{
                // has such user in DB
                Swal.fire({
                    icon: 'success',
                    title: 'Great',
                    text: 'Recover password email sent',
                })
            }
            $('#send_email_button').removeAttr('disabled')
        }
    })
})
