let coords = {
    lat: 0,
    lon: 0
};
let temperature = 0;
let dailySave = {};
let city = '';

let hourMask = (hour, min) => {
    if(hour <= 9) {
        if(min <= 9){
            return '0'+hour+':'+'0'+min
        } else {
            return '0'+hour+':'+min
        }
    } else {
        if(min <= 9){
            return hour+':'+'0'+min
        } else {
            return hour+':'+min
        }
    }
}

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

let setTheIcon = (id) => {
    if (id >= 200 && id <= 232) {
        return './images/weather-status/thunderstorm.png'
    } else if (id >= 300 && id <= 321) {
        if (currentHours > sunrise.getHours() && currentHours < sunset.getHours()) {
            return './images/weather-status/rainDay.png';
        } else {
            return './images/weather-status/rainNight.png';
        }
    } else if (id >= 500 && id <= 531) {
        if (id >= 500 && id <= 504) {
            if (currentHours > sunrise.getHours() && currentHours < sunset.getHours()) {
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
        if (currentHours > sunrise.getHours() && currentHours < sunset.getHours()) {
            return './images/weather-status/clearDay.png'
        } else {
            return './images/weather-status/clearNight.png'
        }
    } else if (id >= 801 && id <= 804) {
        if (id===801) {
            if (currentHours > sunrise.getHours() && currentHours < sunset.getHours()) {
                return './images/weather-status/fewCloudsDay.png'
            } else {
                return './images/weather-status/fewCloudsNight.png'
            }
        } else if (id===802){
            return './images/weather-status/scatteredClouds.png'
        } else if (id===803 || id===804){
            return './images/weather-status/brokenClouds.png'
        }
    }
}

fetch('https://api.freegeoip.app/json/?apikey=d90ea8c0-b6a5-11ec-ac3c-35aeccb7f48a')
    .then(res => {
        return res.json()
    })
    .then(data => {
        city = data.city;
        $('#currently__city').text(city)
        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8635c93cf4a0383f1fdc0ae02896a802')
            .then(res => {
                return res.json()
            })
            .then(data => {
                coords.lat = data.coord.lat;
                coords.lon = data.coord.lon;
                $('#currently__weather-icon').attr('src', setTheIcon(data.weather['0'].id));
                $('#currently__weather').html(firstToUpper(data.weather['0'].description + ', '));
                $('#currently__temperature').html((data.main.temp - 273).toFixed(1) + '&#8451');

                $('#currently__wind-speed').html(data.wind.speed + ' m/s')
                $('#currently__wind-direction').css('transform', 'rotate(' + data.wind.deg + 'deg)');

                $('#current__humidity').html(data.main.humidity + '%');
                $('#current__pressure').html(data.main.pressure + ' hPa')

                let timesone = new Date(data.timezone);
                let sunrise = new Date(data.sys.sunrise);
                $('#currently__sunrise').html(hourMask(sunrise.getHours() + timesone.getHours(), sunrise.getMinutes()));
                let sunset = new Date(data.sys.sunset);
                $('#currently__sunset').html(hourMask(sunset.getHours() + timesone.getHours() + 12, sunset.getMinutes()));
                console.log(data);

                fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + coords.lat + '&lon=' + coords.lon + '&appid=8635c93cf4a0383f1fdc0ae02896a802')
                    .then(res => {
                        return res.json()
                    })
                    .then(data => {
                        $('#currently__max-temp').html((data.daily['0'].temp.max - 273).toFixed(1) + '&#8451');
                        $('#currently__min-temp').html((data.daily['0'].temp.min - 273).toFixed(1) + '&#8451');
                        dailySave = data.daily;
                        console.log(data);
                        for (let i = 0; i != dailySave.length; i++) {
                            console.log((dailySave[i].temp.day - 273.15).toFixed(2))
                        }
                        console.log(dailySave);
                    })
            });

    })