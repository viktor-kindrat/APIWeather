let coords = {
    lat: 0,
    lon: 0
};
let temperature = 0;
let city = '';

let hourMask = (hour, min) => {
    if (hour <= 9) {
        if (min <= 9) {
            return '0' + hour + ':' + '0' + min
        } else {
            return '0' + hour + ':' + min
        }
    } else {
        if (min <= 9) {
            return hour + ':' + '0' + min
        } else {
            return hour + ':' + min
        }
    }
}
let weekDays = ['null', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

let time = new Date();
let currentMin = time.getMinutes();
let currentHours = time.getHours();
$('#current__time').html(hourMask(currentHours, currentMin));
setInterval(() => {
    time = new Date();
    currentMin = time.getMinutes();
    currentHours = time.getHours();
    $('#current__time').html(hourMask(currentHours, currentMin));
}, 1000)

let setDays = (num) => {
    let index = num + 1;
    for (let i = 2; i != 6; i++) {
        if (index != 8) {
            $('#future__day' + i).html(weekDays[index]);
            index++;
        } else {
            index = 1;
            $('#future__day' + i).html(weekDays[index]);
            index = 2;
        }
    }
}

setDays(time.getDay());

let setHours = (hours, min) => {
    let currentHour = hours + 2;
    $('#currentlu__hour0').html(hourMask(hours, min))
    for (let i = 1; i != 8; i++) {
        console.log(currentHour);
        currentHour = currentHour + 2;
        if (currentHour >= 24) {
            currentHour = 0;
            $('#currentlu__hour' + i).html(hourMask(currentHour, 0))
        } else {
            $('#currentlu__hour' + i).html(hourMask(currentHour, 0))
        }
    }
    return true
}

let setHourlyWeather = (path) => {
    let num = 0;
    for (let i = 0; i != 8; i++) {
        $('#currently__temperature' + i).html((path[num].temp - 273).toFixed(0) + '&#8451')
        num += 2;
    }
    return true
}

setHours(currentHours, currentMin);

let firstToUpper = (str) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1)
}


let toCamelCase = (str) => {
    let arr = str.split(' ');
    for (let i = 0; i != arr.length; i++) {
        if (i != 0) {
            arr[i] = firstToUpper(arr[i]);
        }
    }
    return arr.join('');
}

let setTheBg = (temp) => {
    if (temp <= 0) {
        $('.wrap').css('background', 'linear-gradient(90.9deg, #E0C3FC 0.73%, #8EC5FC 99.22%)');
    } else if (temp > 0 && temp <= 20) {
        $('.wrap').css('background', 'linear-gradient(90.52deg, #74EBD5 0.33%, #9FACE6 99.44%)');
    } else if (temp > 20) {
        $('.wrap').css('background', 'linear-gradient(270.5deg, #FFF1A3 0.42%, #FA709A 98.36%)');
    }
}

let setTheIcon = (id, sunrise, sunset, timezone) => {
    if (id >= 200 && id <= 232) {
        return './images/weather-status/thunderstorm.png'
    } else if (id >= 300 && id <= 321) {
        if (currentHours > sunrise.getHours() + timezone.getHours() && currentHours < sunset.getHours() + timezone.getHours()) {
            return './images/weather-status/rainDay.png';
        } else {
            return './images/weather-status/rainNight.png';
        }
    } else if (id >= 500 && id <= 531) {
        if (id >= 500 && id <= 504) {
            if (currentHours > sunrise.getHours() + timezone.getHours() && currentHours < sunset.getHours() + timezone.getHours()) {
                return './images/weather-status/rainDay.png'
            } else {
                return './images/weather-status/rainNight.png'
            }
        } else if (id === 511) {
            return './images/weather-status/snow.png'
        } else {
            return './images/weather-status/showerRain.png'
        }
    } else if (id >= 600 && id <= 622) {
        return './images/weather-status/snow.png'
    } else if (id >= 701 && id <= 781) {
        return './images/weather-status/mist.png'
    } else if (id === 800) {
        if (currentHours > sunrise.getHours() + timezone.getHours() && currentHours < sunset.getHours() + timezone.getHours()) {
            return './images/weather-status/clearDay.png'
        } else {
            return './images/weather-status/clearNight.png'
        }
    } else if (id >= 801 && id <= 804) {
        if (id === 801) {
            if (currentHours > sunrise.getHours() + timezone.getHours() && currentHours < sunset.getHours() + timezone.getHours()) {
                return './images/weather-status/fewCloudsDay.png'
            } else {
                return './images/weather-status/fewCloudsNight.png'
            }
        } else if (id === 802) {
            return './images/weather-status/scatteredClouds.png'
        } else if (id === 803 || id === 804) {
            return './images/weather-status/brokenClouds.png'
        }
    }
}

let setHourlyIcons = (path, sunrise, sunset, timezone) => {
    let num = 0;
    for (let i = 0; i != 8; i++) {
        $('#currently__hour-weather-icon' + i).css('background', 'url("' + setTheIcon(path[num].weather[0].id, sunrise, sunset, timezone) + '") center center no-repeat no-repeat');
        $('#currently__hour-weather-icon' + i).css('backgroundSize', 'contain');
        num = num + 2;
    }
    return true
}

fetch('https://api.freegeoip.app/json/?apikey=d90ea8c0-b6a5-11ec-ac3c-35aeccb7f48a')
    .then(res => {
        return res.json()
    })
    .then(data => {
        console.log(data);
        city = data.city;
        $('#currently__city').html(city + '<img src="https://countryflagsapi.com/svg/' + data.country_name + '" alt="flag" class="currently__flag">')
        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8635c93cf4a0383f1fdc0ae02896a802')
            .then(res => {
                return res.json()
            })
            .then(data => {
                coords.lat = data.coord.lat;
                coords.lon = data.coord.lon;

                $('#currently__wind-speed').html(data.wind.speed + ' m/s')
                $('#currently__wind-direction').css('transform', 'rotate(' + data.wind.deg + 'deg)');

                $('#current__humidity').html(data.main.humidity + '%');
                $('#current__pressure').html(data.main.pressure + ' hPa')

                let timesone = new Date(data.timezone);
                let sunrise = new Date(data.sys.sunrise);
                $('#currently__sunrise').html(hourMask(sunrise.getHours() + timesone.getHours(), sunrise.getMinutes()));
                let sunset = new Date(data.sys.sunset);
                $('#currently__sunset').html(hourMask(sunset.getHours() + timesone.getHours() + 12, sunset.getMinutes()));

                $('#currently__weather-icon').attr('src', setTheIcon(data.weather['0'].id, sunrise, sunset, timesone));
                $('#currently__weather').html(firstToUpper(data.weather['0'].description + ', '));
                $('#currently__temperature').html((data.main.temp - 273).toFixed(1) + '&#8451');
                setTheBg((data.main.temp - 273).toFixed(0))
                console.log(data);

                fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + coords.lat + '&lon=' + coords.lon + '&appid=8635c93cf4a0383f1fdc0ae02896a802')
                    .then(res => {
                        return res.json()
                    })
                    .then(data => {
                        console.log(data);
                        let sunrise = new Date(data.current.sunrise);
                        let sunset = new Date(data.current.sunset);
                        let timesone = new Date(data.timezone_offset);
                        setHourlyWeather(data.hourly);
                        setHourlyIcons(data.hourly, sunrise, sunset, timesone)
                        $('#currently__max-temp').html((data.daily['0'].temp.max - 273).toFixed(1) + '&#8451');
                        $('#currently__min-temp').html((data.daily['0'].temp.min - 273).toFixed(1) + '&#8451');
                        $('#preloader').fadeToggle(300);
                        for (let i = 1; i != 6; i++) {
                            $('#future__wind-speed' + i).html(data.daily[i].wind_speed + ' m/s')
                            $('#future__wind-direction' + i).css('transform', 'rotate(' + data.daily[i].wind_deg + 'deg)');

                            $('#future__max-temp' + i).html((data.daily[i].temp.max - 273).toFixed(0) + '&#8451');
                            $('#future__min-temp' + i).html((data.daily[i].temp.min - 273).toFixed(0) + '&#8451');

                            $('#future__weather-status' + i).css('background', 'url("' + setTheIcon(data.daily[i].weather[0].id, sunrise, sunset, timesone) + '") center center no-repeat no-repeat');
                            $('#future__weather-status' + i).css('backgroundSize', 'contain');

                            let timezone = new Date(data.timezone_offset);
                            let thisSunrise = new Date(data.daily[i].sunrise);
                            let thisSunset = new Date(data.daily[i].sunset);
                            $('#future__sunrise' + i).html(hourMask(thisSunrise.getHours() + timezone.getHours(), thisSunrise.getMinutes()));
                            $('#future__sunset' + i).html(hourMask(thisSunset.getHours() + timezone.getHours(), thisSunset.getMinutes()));
                        }
                    })
            });
    });

$('.currently__city').click(function () {
    $('.left').hide(300);
    $('.right').hide(300);
    setTimeout(() => {
        $('#find').css('display', 'flex');
    }, 300);
})

$('.find__input').focus(function () {
    $('.find__placeholder').css({
        'top': '-5px',
        'opacity': '1',
    })
})
$('.find__input').blur(function () {
    if ($(this).val() === '') {
        $('.find__placeholder').css({
            'top': '35px',
            'opacity': '0.4',
        })
    }
})

$('#find__btn').click(function () {
    $('#preloader').fadeToggle(300);
    city = firstToUpper($('.find__input').val());
    $('.find__placeholder').css({
        'top': '35px',
        'opacity': '0.4',
    })
    $('.find__input').val('')
    $('#find').css('display', 'none');
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8635c93cf4a0383f1fdc0ae02896a802')
        .then(res => {
            return res.json()
        })
        .then(data => {
            coords.lat = data.coord.lat;
            coords.lon = data.coord.lon;

            $('#currently__wind-speed').html(data.wind.speed + ' m/s')
            $('#currently__wind-direction').css('transform', 'rotate(' + data.wind.deg + 'deg)');

            $('#current__humidity').html(data.main.humidity + '%');
            $('#current__pressure').html(data.main.pressure + ' hPa')

            let timesone = new Date(data.timezone);
            let sunrise = new Date(data.sys.sunrise);
            $('#currently__sunrise').html(hourMask(sunrise.getHours() + timesone.getHours(), sunrise.getMinutes()));
            let sunset = new Date(data.sys.sunset);
            $('#currently__sunset').html(hourMask(sunset.getHours() + timesone.getHours() + 12, sunset.getMinutes()));

            $('#currently__weather-icon').attr('src', setTheIcon(data.weather['0'].id, sunrise, sunset, timesone));
            $('#currently__weather').html(firstToUpper(data.weather['0'].description + ', '));
            $('#currently__temperature').html((data.main.temp - 273).toFixed(1) + '&#8451');
            setTheBg((data.main.temp - 273).toFixed(0))
            console.log(data);

            $('#currently__city').html(city + '<img src="https://countryflagsapi.com/svg/' + data.sys.country + '" alt="flag" class="currently__flag">')

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + coords.lat + '&lon=' + coords.lon + '&appid=8635c93cf4a0383f1fdc0ae02896a802')
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    console.log(data);
                    let sunrise = new Date(data.current.sunrise);
                    let sunset = new Date(data.current.sunset);
                    let timesone = new Date(data.timezone_offset);
                    setHourlyWeather(data.hourly);
                    setHourlyIcons(data.hourly, sunrise, sunset, timesone)
                    $('#currently__max-temp').html((data.daily['0'].temp.max - 273).toFixed(1) + '&#8451');
                    $('#currently__min-temp').html((data.daily['0'].temp.min - 273).toFixed(1) + '&#8451');
                    $('#preloader').fadeToggle(300);
                    for (let i = 1; i != 6; i++) {
                        $('#future__wind-speed' + i).html(data.daily[i].wind_speed + ' m/s')
                        $('#future__wind-direction' + i).css('transform', 'rotate(' + data.daily[i].wind_deg + 'deg)');

                        $('#future__max-temp' + i).html((data.daily[i].temp.max - 273).toFixed(0) + '&#8451');
                        $('#future__min-temp' + i).html((data.daily[i].temp.min - 273).toFixed(0) + '&#8451');

                        $('#future__weather-status' + i).attr('src', setTheIcon(data.daily[i].weather[0].id, sunrise, sunset, timesone));

                        let timezone = new Date(data.timezone_offset);
                        let thisSunrise = new Date(data.daily[i].sunrise);
                        let thisSunset = new Date(data.daily[i].sunset);
                        $('#future__sunrise' + i).html(hourMask(thisSunrise.getHours() + timezone.getHours(), thisSunrise.getMinutes()));
                        $('#future__sunset' + i).html(hourMask(thisSunset.getHours() + timezone.getHours(), thisSunset.getMinutes()));
                    }
                    $('.left').show(300);
                    $('.right').show(300);
                })
        });
})