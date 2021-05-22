//create header append to body
window.onload = () => {
  header = document.createElement("header");
  document.body.appendChild(header);
  let h1 = document.createElement("H1");
  h1.append("Weather in Hong Kong");
  header.appendChild(h1);

  let icon = document.createElement("div");
  icon.setAttribute("class", "icon");
  header.appendChild(icon);

  //create curernt weather element
  //current weather icon
  let weathericon = document.createElement("img");
  weathericon.setAttribute("src", "");
  weathericon.setAttribute("id", "weathericon");

  //current temperature
  let temp = document.createElement("div");
  temp.setAttribute("class", "temp");
  let tempimg = document.createElement("img");
  tempimg.setAttribute("src", "./thermometer.png");
  temp.appendChild(tempimg);
  tempnum = document.createElement("p");
  tempnum.setAttribute("id", "tempnum");
  temp.appendChild(tempnum);

  //current humidity
  let humid = document.createElement("div");
  humid.setAttribute("class", "humid");
  let humidimg = document.createElement("img");
  humidimg.setAttribute("src", "./drop.png");
  humid.appendChild(humidimg);
  humidnum = document.createElement("p");
  humidnum.setAttribute("id", "humidnum");
  humid.appendChild(humidnum);

  //current rainfall
  let rain = document.createElement("div");
  rain.setAttribute("class", "rain");
  let rainimg = document.createElement("img");
  rainimg.setAttribute("src", "./rain.png");
  rain.appendChild(rainimg);
  rainnum = document.createElement("p");
  rainnum.setAttribute("id", "rainnum");
  rain.appendChild(rainnum);

  //current uv
  let uv = document.createElement("div");
  uv.setAttribute("class", "uv");
  let uvimg = document.createElement("img");
  uv.appendChild(uvimg);
  uvnum = document.createElement("p");
  uvnum.setAttribute("id", "uvnum");
  uv.appendChild(uvnum);

  //reload
  let reload = document.createElement("input");
  reload.setAttribute("type", "image");
  reload.setAttribute("src", "./reload.png");
  reload.setAttribute("id", "reload");
  reload.addEventListener("click", function () {
    window.location.reload();
  });

  //last update
  let update = document.createElement("p");
  update.setAttribute("class", "update");

  //append current weather element to header
  icon.appendChild(weathericon);
  icon.appendChild(temp);
  icon.appendChild(humid);
  icon.appendChild(rain);
  icon.appendChild(uv);
  icon.appendChild(reload);
  icon.appendChild(update);

  //create main tag
  let main = document.createElement("main");
  document.body.appendChild(main);

  //nav tag
  let nav = document.createElement("nav");
  main.appendChild(nav);

  //nav tab
  let temptab = document.createElement("button");
  temptab.setAttribute("type", "button");
  temptab.setAttribute("id", "temptab");
  temptab.innerHTML = "Temperature";
  let forecasttab = document.createElement("button");
  forecasttab.setAttribute("type", "button");
  forecasttab.innerHTML = "Forecast";
  forecasttab.setAttribute("id", "forecasttab");
  nav.appendChild(temptab);
  nav.appendChild(forecasttab);

  //section
  let section = document.createElement("section");
  main.appendChild(section);
  let page1 = document.createElement("div");
  let page2 = document.createElement("div");
  page1.setAttribute("id", "page1");
  page2.setAttribute("id", "page2");
  section.appendChild(page1);
  section.appendChild(page2);

  //fetch currentweather
  currentweather().catch((error) => {
    console.error(error);
  });

  //fetch forcast
  forcastweather().catch((error) => {
    console.error(error);
  });

  //9 day weather
  async function forcastweather() {
    const response = await fetch(
      "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en"
    );
    if (response.status == 200) {
      const WF = await response.text();

      let json_WF = JSON.parse(WF);
      for (let i = 0; i < 9; i++) {
        let div = document.createElement("div");
        div.setAttribute("class", "forecast");
        //forecast detail
        let casticon = document.createElement("img");
        casticon.setAttribute(
          "src",
          "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" +
            json_WF.weatherForecast[i].ForecastIcon +
            ".png"
        );
        let date = document.createElement("div");
        date.innerHTML =
          json_WF.weatherForecast[i].forecastDate.slice(6, 8) +
          " / " +
          json_WF.weatherForecast[i].forecastDate.slice(4, 6);

        date.setAttribute("id", "forecastdate");
        let week = document.createElement("div");
        week.innerHTML = json_WF.weatherForecast[i].week;
        let foretemp = document.createElement("div");
        foretemp.innerHTML =
          json_WF.weatherForecast[i].forecastMintemp.value +
          "&#8451;" +
          " | " +
          json_WF.weatherForecast[i].forecastMaxtemp.value +
          "&#8451;";
        let forehumid = document.createElement("div");
        forehumid.innerHTML =
          json_WF.weatherForecast[i].forecastMinrh.value +
          "%" +
          " - " +
          json_WF.weatherForecast[i].forecastMaxrh.value +
          "%";

        div.appendChild(casticon);
        div.appendChild(date);
        div.appendChild(week);
        div.appendChild(foretemp);
        div.appendChild(forehumid);
        page2.appendChild(div);
      }
    } else {
      console.log("HTTP return status: " + response.status);
    }
  }

  //current weather
  async function currentweather() {
    const response = await fetch(
      "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en"
    );
    if (response.status == 200) {
      const WR = await response.text();

      let json_WR = JSON.parse(WR);
      //weather icon
      let imagesrc = json_WR.icon[0];
      document
        .getElementById("weathericon")
        .setAttribute(
          "src",
          "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" +
            imagesrc +
            ".png"
        );
      //current degree celcius
      let tempnum = json_WR.temperature.data[1].value;
      document.getElementById("tempnum").innerHTML = tempnum + "&#8451;";
      //current hudmidity
      let humidnum = json_WR.humidity.data[0].value;
      document.getElementById("humidnum").innerHTML = humidnum + "%";
      //current rainfall
      let rainnum = json_WR.rainfall.data[13].max;
      document.getElementById("rainnum").innerHTML = rainnum + "mm";
      //current UV
      if (json_WR.uvindex.hasOwnProperty("data")) {
        let uvnum = json_WR.uvindex.data[0].value;
        document.getElementById("uvnum").innerHTML = uvnum;
        uvimg.setAttribute("src", "./UVindex.png");
      } else {
        console.log("Uv return null");
      }

      //current warning
      if (json_WR.warningMessage[0] != null) {
        //warning
        let warning = document.createElement("div");
        warning.setAttribute("id", "warning");
        let warningtitle = document.createElement("p");
        warningtitle.setAttribute("id", "warningtitle");
        warning.appendChild(warningtitle);
        let arrow = document.createElement("img");
        warning.appendChild(arrow);
        arrow.setAttribute("src", "./arrow.png");
        warningtitle.innerHTML = "Warning";
        header.appendChild(warning);
        //warning text
        let warningtext = document.createElement("p");
        warningtext.setAttribute("id", "warningtext");
        warningtext.innerHTML = json_WR.warningMessage[0];
        warning.appendChild(warningtext);
      }
      //last update
      let updatetime = json_WR.updateTime;
      document.getElementsByClassName("update")[0].innerHTML =
        "Last Update: " + updatetime.slice(11, 16);

      //district temp
      for (let i = 0; i < json_WR.temperature.data.length - 1; i++) {
        let div = document.createElement("div");
        div.setAttribute("id", "district");
        let district = document.createElement("div");
        let temp = document.createElement("div");
        district.setAttribute("id", "districtnm");
        div.appendChild(district);
        div.appendChild(temp);
        page1.appendChild(div);
        district.innerHTML = json_WR.temperature.data[i].place;
        temp.innerHTML = json_WR.temperature.data[i].value + "&#8451;";

        //district button
        let closebtn = document.createElement("input");
        closebtn.setAttribute("type", "image");
        closebtn.setAttribute("src", "./cancel.ico");
        div.appendChild(closebtn);
        closebtn.addEventListener("click", () => {
          div.setAttribute("style", "display: none");
        });
      }
    } else {
      console.log("HTTP return status: " + response.status);
    }
  }
  //show function
  function show(shown, hidden) {
    shown.style.display = "flex";
    hidden.style.display = "none";
    return false;
  }

  //temperature button
  temptab.addEventListener("click", () => show(page1, page2));
  temptab.addEventListener("click", () => {
    temptab.style.background = "#b7b7a4";
    forecasttab.style.background = "#f0efeb";
  });

  //forecast button
  forecasttab.addEventListener("click", () => show(page2, page1));
  forecasttab.addEventListener("click", () => {
    forecasttab.style.background = "#b7b7a4";
    temptab.style.background = "#f0efeb";
  });

  show(page1, page2);
};
