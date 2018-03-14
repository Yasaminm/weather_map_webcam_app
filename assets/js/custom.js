(function () {
    
  var options = {
      city: 'Berlin,de',
      lang: 'de',
      units: 'metric',
      unitSigns: {
          metric: '° C',
          imperial: '° F'
      }
  };
  //We can call such objects in two ways :
  //1 - options.unitSigns['metric']//auf ruf von javaScript
  //2 - options.unitSigns.metric //auf ruf von javaScript
  
  var url = 'http://api.openweathermap.org/data/2.5/weather?q=';
//  var city = 'Phuket';
  var units = '&units=';
//  var lang ;
  var lang = '&lang=';
  var appId = '&appid=e56c5866972cebc60f3d29e6b258800c';
  var iconUrl = 'http://openweathermap.org/img/w/';
  var timeZoneUrl = 'https://maps.googleapis.com/maps/api/timezone/json';
  var timeZoneAppId = 'AIzaSyAlDebeVFdWs3mk-pJBLANa2zwZmldUhrs';
  var cities = ['Berlin,de', 'Phuket', 'Rome', 'Marseille', 'Moscow,ru', 'new york', 'oymyakon'];
  
  var $weatherBox = $('[data-role="weather"]');
  var $webcamBox = $('[data-role="webcams"]');
  var $selectLang = $('input[name="lang"]');
  var $selectUnits = $('input[name="units"]');
  
  var $selectCities = $('select[name="countries"]');
  ///////////////////////////////////////////////////////////////////
 
    $( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
    console.log(data);
        var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val(),
            html = "";
        $ul.html( "" );
        if ( value && value.length > 2 ) {
            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
            $ul.listview( "refresh" );
            $.ajax({
                url: "http://gd.geobytes.com/AutoCompleteCity",
                dataType: "jsonp",
                crossDomain: true,
                data: {
                    q: $input.val()
                }
            })
            .then( function ( response ) {
                $.each( response, function ( i, val ) {
                console.log(val);
                html += "<li>" + val + "</li>";
                });
                $ul.html( html );
                $ul.listview( "refresh" );
                $ul.trigger( "updatelayout");
                $('li').on('click', selectedOption);

//     
            });

        }

    });

  
  /////////////////////////////////////////////////////////////////////
  
  
//  $selectCities.change(selectedOption);
  
  $selectLang.click(function(){
      options.lang = $(this).val();
      localStorage.setItem('lang', $(this).val());
      $weatherBox.html(null);
      getWeather();
  });
  
  $selectUnits.change(function(){
      options.units = $(this).val();
      localStorage.setItem('units', $(this).val());
      console.log('hi');
      $weatherBox.html(null);
      getWeather();
  });
  
  createSelectBox(cities); 
  getStorageData();
  setSelection();
  getWeather();
  
  
  function setSelection(){
      //options.lang de
      //  [value="de"]
      //$('input[value="'+options.lang+'"]').attr('checked', 'checked');
      $('input[name="lang"][value="'+options.lang+'"]').attr('checked','checked');
      $('input[name="units"][value="'+options.units+'"]').attr('checked','checked');
      $('select[name="cities"]').find('option[value="'+options.city+'"]').attr('selected', 'selected');
//      $('<h2>').find(city).attr();
//        $('select[value="''"]')
  };
  
  
  function selectedOption(){
      options.city = $(this).html();
//      console.log($(this).html());
      if (options.city === ' ')
          return false;
      localStorage.setItem('city', $(this).val());
      $weatherBox.html(null);
     $('li').remove();
     $('#autocomplete-input').val($(this).html());
      getWeather();
  };
  
  function getStorageData(){
      if(window.localStorage){
          
         //language check
         var lang = localStorage.getItem('lang');
         var units = localStorage.getItem('units');
         var city = localStorage.getItem('city');
         
          if(lang !== null && lang !== ''){
              options.lang = localStorage.getItem('lang');
          }
          if(units !== null && units !==''){
              options.units = localStorage.getItem('units');
          }
          if(city !== null && city !== ''){
              options.city = localStorage.getItem('city');
          }
      }
  }
  
  function getWeather(){
      $.get(url +   options.city + units +options.units + lang + options.lang+ appId, createBox);
  };
//    for (var key in cities) {
//  //
//  }
    
    function createSelectBox(data){
//        console.log($selectCities);
        $('<option>').text('Bitte Stadt auswählen').val(' ').appendTo($selectCities);
        $.each(data, function(i, city){
            $('<option>').text(city).val(city).appendTo($selectCities);
        });
   }
   
  function createBox(data) {
    var icon = iconUrl + data.weather["0"].icon + '.png';
    var temp = data.main.temp;
    var weatherText = data.weather["0"].description;
    var city = data.name;
//    var latlon = data.coord.lat + ',' + data.coord.lon;
//    var param = 'location=' + latlon + '&timestamp=0&' + timeZoneAppId;
//    var dtOw = data.dt;
//    var unitSigns;


    //create box
//    var $weatherBox = $('[data-role="weather"]');
    var $parentDiv = $('<div>').addClass('ui-grid-a').appendTo($weatherBox);
   
      
      var $cityDiv = $('<div>').attr('data-realtime','').addClass('ui-block-a').appendTo($parentDiv);
    $('<h2>').text(city).appendTo($cityDiv);

    var $iconDiv = $('<div>').addClass('ui-block-b').appendTo($parentDiv);
    $('<img>').attr('src', icon).appendTo($iconDiv);
//    (options.units === 'imperial')? unitSigns = '°F': unitSigns = '°C'
    $('<span>').text(temp + options.unitSigns[options.units] ).appendTo($iconDiv);
    $('<p>').text(weatherText).appendTo($iconDiv);
    $('<hr>').appendTo($parentDiv);

       getLocalTime({
            timestamp:Date.now(),
            format:'d.m.Y H:i:s',
            lat: data.coord.lat,
            lon: data.coord.lon,
            callback: viewLocalRealTime
        });
    //webcoms
//    console.log(data);
    createWebcamBox(data.coord.lat, data.coord.lon);
    
  }
  function getUTCDate(t){
      var d = new Date(t);
      return{
           h: (d.getUTCHours() < 10)? '0' + d.getUTCHours() : d.getUTCHours(),
           i: (d.getUTCMinutes() < 10)? '0' + d.getUTCMinutes() : d.getUTCMinutes(),
           s: (d.getUTCSeconds() < 10)? '0' + d.getUTCSeconds() : d.getUTCSeconds(),
           d: (d.getUTCDate() < 10)? '0' + d.getUTCDate() : d.getUTCDate(),
           m: ((d.getUTCMonth()+1) < 10)? '0' + (d.getUTCMonth()+1) : (d.getUTCMonth()+1),
           Y: d.getUTCFullYear(),
           day: d.getUTCDay() //0 Sunday 1 Monday
       };
  };
  function getLocalTime(opts){
    var latlon = opts.lat + ',' + opts.lon;
    var param = 'location=' + latlon + '&timestamp=0&' + timeZoneAppId;
      $.get(timeZoneUrl, param, function (timeData) {
          var ts = opts.timestamp + (timeData.rawOffset * 1000);
          var d = getUTCDate(ts);
          opts.callback(d);
      });
  };
  
  function viewLocalRealTime(time){
      //days = [.../..../...]
      d= new Date();
      var days = new Array(7);
days[0] = "Son";
days[1] = "Mon";
days[2] = "Dins";
days[3] = "Mit";
days[4] = "Don";
days[5] = "Frei";
days[6] = "Sams";

//var n = weekday[d.getDay()];
//      console.log(time.day);
      $('<p>').text( days[d.getDay()]+ ' ' +time.h +':'+time.i).appendTo($('[data-realtime]'));
  };

    function createWebcamBox(lat, lon){
        
        $.getJSON('api_webcam.php', 'lat='+lat+ '&lon='+lon, function(data){
//            console.log(data);
             $webcamBox.html(null);
            $.each(data, function(i, webcam){
                console.log(webcam.image);
//                for(i=0; i<webcam.image.length; i++){
                
//                var ut = Date.now() + webcam.update *1000;
//                var t = new Date(webcam.update *1000);
//                $('<p>').text(t.toUTCString()).appendTo($webcamBox);
////            }

            getLocalTime({
            timestamp:webcam.update*1000,
            lat: lat,
            lon: lon,
            callback: function(time){
                $('<div>').text(webcam.title).appendTo($webcamBox);
                $('<img>').attr('src', webcam.image).appendTo($webcamBox);
                $('<p>')
                    .text(time.d + '.' + time.m + '.'+ time.Y+ ' ' +time.h + ':' + time.i)
                    .appendTo($webcamBox);
            }
        });
            });
        });
        
    }

})();

