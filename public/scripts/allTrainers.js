$('#passAndCancel-btn').click(() => {
    const trainer_id=$('#passAndCancel-btn').attr('trainer-id')
    const trainer_pass_audit=$('#passAndCancel-btn').attr('pass-audit')

    const userInfo={
        trainer_id,
        trainer_pass_audit
    }

    console.log(userInfo)
    // ajax
    $.ajax({
        type:'POST',
        url:'/auditor/passAudit',
        data:userInfo,
        success:(data)=>{
            if(data==='-2'){
                // server error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong, please try again later',
                    footer: '<a href="/auditor/allTrainers">Click me to refresh the page</a>'
                })
            }else if(data==='0'){
                // no such trainer
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'The trainer might be deleted',
                    footer: '<a href="/auditor/allTrainers">Click me to refresh the page</a>'
                })
            }else if(data==='1'){
                // refresh the page
                window.location.href='/auditor/allTrainers'
            }
        }
    })
})
