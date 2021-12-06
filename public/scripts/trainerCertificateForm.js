const province_cities = [
    {
        name: 'Alberta',
        cities: ['Calgary', 'Edmonton', 'Red Deer', 'Strathcona County']
    },
    {
        name: 'British_Columbia',
        cities: ['Vancouver', 'Surrey', 'Burnaby', 'Richmond']
    },
    {
        name: 'Manitoba',
        cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie']
    },
    {
        name: 'New_Brunswick',
        cities: ['Fredericton', 'Miramichi', 'Moncton', 'Saint John']
    },
    {
        name: 'Newfoundland_and_Labrador',
        cities: ['St. John\'s', 'Mount Pearl', 'Corner Brook']
    },
    {
        name: 'Nova_Scotia',
        cities: ['Halifax', 'Cape Breton', 'Truro']
    },
    {
        name: 'Ontario',
        cities: ['Toronto', 'Vaughan', 'Waterloo', 'Welland']
    },
    {
        name: 'Prince_Edward_Island',
        cities: ['Charlottetown', 'Summerside', 'Alberton']
    },
    {
        name: 'Quebec',
        cities: ['Montreal', 'Québec', 'Sherbrooke']
    },
    {
        name: 'Saskatchewan',
        cities: ['North Battleford', 'Prince Albert', 'Regina', 'Saskatoon']
    },
    {
        name: 'Northwest_Territories',
        cities: ['Wekweeti', 'Whatì', 'Yellowknife']
    },
    {
        name: 'Nunavut',
        cities: ['Arctic Bay', 'Arviat', 'Baker Lake']
    },
    {
        name: 'Yukon',
        cities: ['Teslin', 'Watson Lake', 'Whitehorse']
    }]

window.addEventListener('load', () => {
    $.each(province_cities, (index) => {
        const province=province_cities[index].name
        const cities=province_cities[index].cities
        let option=$(`<option value=${province}>${province.replaceAll('_', ' ')}</option>`)
        $('#trainer_province').append(option)
    })
})

$('#trainer_province').change((e)=>{
    $('#trainer_city').empty()
    let option=$(`<option selected value="-1">Select city</option>`)
    $('#trainer_city').append(option)

    const currentProvince=e.target.value
    $.each(province_cities, (index,data)=>{
        if(data.name===currentProvince){
            const cities=data.cities
            $.each(cities, (index, city) => {
                let option=$(`<option value=${city}>${city}</option>`)
                $('#trainer_city').append(option)
            })

        }
    })
})

$('#submit_button').click(() => {
    const trainer_full_name = $('#trainer_full_name').val()
    const trainer_years_of_training = $('#trainer_years_of_training').val()
    const trainer_province = $('#trainer_province option:selected').val()
    const trainer_city = $('#trainer_city option:selected').val()

    if (trainer_full_name.trim() === ''
        || trainer_years_of_training.trim() === ''
        || trainer_province==='-1'
        || trainer_city==='-1') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all fields',
        })
        return
    }
    const userInfo = {
        trainer_full_name,
        trainer_years_of_training,
        trainer_province,
        trainer_city
    }

    console.log(userInfo)
    // ajax
    $.ajax({
        type: 'POST',
        url: '/trainer/certificate',
        data: userInfo,
        success: (data) => {
            if (data === '0') {
                // no such trainer
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Trainer does not exist',
                    footer: '<a href="/createAccount">Register one?</a>'
                })
            } else if (data === '1') {
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
                        window.location.href = '/trainer/schedule'
                    }
                })
            } else if (data === '-2') {
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
