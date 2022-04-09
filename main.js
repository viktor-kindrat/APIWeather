let coords = {
    lat: 0,
    lon: 0
};
let temperature = 0;
let dailySave = {};

fetch('https://api.openweathermap.org/data/2.5/weather?q=Yavoriv&appid=8635c93cf4a0383f1fdc0ae02896a802')
.then(res=>{
    return res.json()
})
.then(data=>{
    coords.lat = data.coord.lat;
    coords.lon = data.coord.lon;
    console.log(coords.lat);
    console.log(coords.lon);
    console.log(data);
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+coords.lat+'&lon='+coords.lon+'&appid=8635c93cf4a0383f1fdc0ae02896a802')
    .then(res=>{
        return res.json()
    })
    .then(data=>{
        dailySave = data.daily;
        console.log(data);
        for(let i = 0; i != dailySave.length; i++){
            console.log((dailySave[i].temp.day - 273.15).toFixed(2))
        }
        console.log(dailySave);
    })
});
