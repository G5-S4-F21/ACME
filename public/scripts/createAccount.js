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
        alert("Please fill all fields")
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
                // jump to trainer detail page
                alert('register successfully')
            }else if(data==='1'){
                alert('The email has been registered')
                // window.load('/createAccount')
            }else{
                alert('Oops! There is something wrong, please try again later')
            }
        }
    })
})

const validateField=(str)=>{
    if(str.trim()!==''){
        return true
    }
}
