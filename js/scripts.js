$(document).ready(function(){
  console.log('scripts loaded');
  
  // Global variables
  {
    var myKey = config.MY_KEY;
    var query = '';
    var url = '';
    var data;
    var html = '';
    var i;
    var j;
    var collegeData = [];
    var latestData;
    var schoolData;
    var data2;
    var meanEarningsClean = [];
    var collegeDataClean = [];
    var locationDataClean = [];
    var namesArrayClean = [];
  }
  // End global variables
  
  // College data variables
  {
    var locale;
    var physicalCampus;
    var admissionRate;
    var inState;
    var outState;
    var reading;
    var writing;
    var math;
    var enrollment;
    var collegeCoords = {lat: 0.0, lng: 0.0};
    var locationData = [];
    var numCards = 0;
    var meanEarnings = [];
    var namesArray = [];
  }
  // End College data variables
  
  // US Dept. of Education API
  $('button').click(function(){
    query = $('#query').val();
    console.log(query);
    url = 'https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name=' + query + '&api_key=' + myKey;   
    html = '';
    
    $.ajax({ // Use collegescorecard data to make cards with selected college data on them
      type: 'GET',
      dataType: 'json',
      url: url,
      data: data,
      async: true,
      success: function(data){
        console.log(data);
        collegeData = data.results;
        if (collegeData.length == 0){
          console.log('length is zero');
          html += 'No colleges matched your query, try using a search without acronyms or initials';
        }
        
        for (i = 0; i < collegeData.length; i++){ //loop through colleges to make cards
          latestData = collegeData[i].latest;
          schoolData = collegeData[i].school;
          locationData[i] = collegeData[i].location;
          namesArray[i] = schoolData.name;
          
          if (schoolData.accreditor == null){ //only list accredited colleges
            locationData[i] = null;
            collegeData[i] = null;
            meanEarnings[i] = null;
            namesArray[i] = null;
            continue;
          }else{
            numCards++;
          }
          
          meanEarnings[i] = latestData.earnings['8_yrs_after_entry'].median_earnings;
          
          // Setting college data vairables
          {
            if (latestData.student.size != null){
              enrollment = numberWithCommas(latestData.student.size);
            }
            
            if (latestData.admissions.sat_scores.midpoint.math == null){
              reading = 'N/A';
              writing = 'N/A';
              math = 'N/A';
            }else{
              reading = latestData.admissions.sat_scores.midpoint.critical_reading;
              writing = latestData.admissions.sat_scores.midpoint.writing;
              math = latestData.admissions.sat_scores.midpoint.math;
            }
            
            if (latestData.cost.tuition.in_state != null){
              inState = '$' + numberWithCommas(latestData.cost.tuition.in_state);
            }
            
            if (latestData.cost.tuition.out_of_state != null){
              outState = '$' + numberWithCommas(latestData.cost.tuition.out_of_state);
            }
            
            if (latestData.admissions.admission_rate.overall == null){ //setting admission rate variable
              admissionRate = 'N/A';
            } else {
              admissionRate = (latestData.admissions.admission_rate.overall * 100).toFixed(2) + '%'; //put in readable percentage form
            }
            
            if (schoolData.online_only == 0){ //calculate whether campus is online or physical
              physicalCampus = 'Yes';
            }else{
              physicalCampus = 'No';
            }
            
            if (schoolData.locale == 11){ //translate code for locale type
              locale = 'Large City';
            } else if (schoolData.locale == 12){
              locale = 'Medium-sized City';
            } else if (schoolData.locale == 13){
              locale = 'Small City';
            } else if (schoolData.locale == 21){
              locale = 'Large Suburb';
            } else if (schoolData.locale == 22){
              locale = 'Medium-sized Suburb';
            } else if (schoolData.locale == 23){
              locale = 'Small Suburb';
            } else if (schoolData.locale == 31){
              locale = 'Town';
            } else if (schoolData.locale == 32){
              locale = 'Distant Town';
            } else if (schoolData.locale == 33){
              locale = 'Remote Town';
            } else if (schoolData.locale == 41){
              locale = 'Rural';
            } else if (schoolData.locale == 42){
              locale = 'Distant Rural';
            } else if (schoolData.locale == 43){
              locale = 'Remote Rural';
            } else {
              locale = 'N/A';
            }
            
          }
          // End setting college data variables
          
          // Building cards
          {
            html += '<div class="college-card flex" id="card' + i + '">'; //start card
            html += '<div class="card-header">'; //start header
            html += '<h2 class="college-name">' + schoolData.name + '</h2>';
            html += '</div>'; //end header
            html += '<div class="card-info flex-center">'; //start info
            html += '<h3 class="general-info">' + 'General Information' + '</h3>';
            html += '<ul class="gen-info-list">'; //start general info list
            html += '<li class="gen-info-item">Location: ' + schoolData.city + ', ' + schoolData.state + '</li>';
            html += '<li class="gen-info-item">Locale: ' + locale + '</li>';
            html += '<li class="gen-info-item">Undergraduate Enrollment: ' + enrollment + '</li>';
            html += '<li class="gen-info-item">Physical Campus: ' + physicalCampus + '</li>';
            html += '<li class="gen-info-item">Website: ' + '<a href="' + schoolData.school_url + '">' + schoolData.school_url + '</a>'+ '</li>';
            html += '</ul>';
            html += '<h3 class="admissions-info">' + 'Admissions Information' + '</h3>';
            html += '<ul class="admissions-info-list">'; //start admissions info list
            html += '<li class="admissions-info-item">Admission Rate: ' + admissionRate + '</li>';
            html += '<li class="admissions-info-item">In-state Tuition: ' + inState + '</li>';
            html += '<li class="admissions-info-item">Out-of-state Tuition: ' + outState + '</li>';
            html += '<li class="admissions-info-item">SAT Reading: ' + reading + '</li>';
            html += '<li class="admissions-info-item">SAT Math: ' + math + '</li>';
            html += '<li class="admissions-info-item">SAT Writing: ' + writing + '</li>';
            html += '</div>'; //end info
            html += '<div class="card-map center-flex" id="card-map' + i + '">'; //start map
            html += '<button class="map-btn" id="map-btn' + i + '"> Show Map'; //render google map btn
            html += '</button>'; //end render google map btn
            html += '</div>'; //end map
            html += '</div>'; // end card
            // End building cards
          }
          $('#results').html(html);
        }
        
        meanEarningsClean = meanEarnings.filter(function(v){return v!==null});
        collegeDataClean = collegeData.filter(function(v){return v!==null});
        locationDataClean = locationData.filter(function(v){return v!==null});
        namesArrayClean = namesArray.filter(function(v){return v!==null});

        console.log(meanEarningsClean);
        console.log(namesArrayClean);
        
        for ( let i = 0; i < collegeData.length; i++ ) {
          let id = 'button#map-btn' + i + '.map-btn';
          $(id).on('click', (e) => {
            handleCardClick(e,i);
          });
        }
        buildChart();
      }
    }); //end of ajax
    // End US Dept. of Education API

  });
  
  // Functions
  {
    function handleCardClick(e, i){
      console.log(i);
      initMap(i);
    }
    
    // Source: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    function numberWithCommas(x) { //adds commas to large numbers
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    // End Source
    
    function initMap(i) {
      // The location of Uluru
      collegeCoords.lat = locationData[i].lat;
      collegeCoords.lng = locationData[i].lon;
      // The map, centered at Uluru
      var map = new google.maps.Map(
        document.getElementById('card-map' + i), {zoom: 16, center: collegeCoords});
        // The marker, positioned at Uluru
        var marker = new google.maps.Marker({position: collegeCoords, map: map});
      }
    }
    // End functions
    function buildChart(){
      var myChart = Highcharts.chart('earnings', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Mean Earnings of Students 4 Years After Graduation'
        },
        subtitle: {
          text: 'Source: U.S. Department of Education'
        },
        xAxis: {
          categories: namesArrayClean,
          overflow: 'allow'
        },
        yAxis: {
          title: {
            text: 'Dollars'
          }
        },
        series: [{
          name: 'Average earnings',
          data: meanEarningsClean
        }]
      });
    }
    
  });
  
  