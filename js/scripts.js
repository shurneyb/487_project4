$(document).ready(function(){
  console.log('scripts loaded');
  
  var myKey = config.MY_KEY;
  var query = '';
  var url = '';
  var data;
  var html = '';
  var i;
  var collegeData = [];
  var latestData;
  var schoolData;

  // College data variables
  var locale;
  var physicalCampus;
  var admissionRate;
  // End College data variables
  
  
  $('button').click(function(){
    query = $('#query').val();
    console.log(query);
    url = 'https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name=' + query + '&api_key=' + myKey;   
    console.log(url);
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

          // Setting college data vairable
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
              locale = 'Medium City';
            } else if (schoolData.locale == 13){
              locale = 'Small City';
            } else if (schoolData.locale == 21){
              locale = 'Large Suburb';
            } else if (schoolData.locale == 22){
              locale = 'Medium Suburb';
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

          // End setting college data variables


          html += '<div class="college-card flex">'; //make card
          html += '<h2 class="college-name">' + schoolData.name + '</h2>';
          html += '<h3 class="general-info">' + 'General Information' + '</h3>';
          html += '<ul class="gen-info-list">'; //start general info list
          html += '<li class="gen-info-item">Location: ' + schoolData.city + ', ' + schoolData.state + '</li>';
          html += '<li class="gen-info-item">Locale: ' + locale + '</li>';
          html += '<li class="gen-info-item">Physical Campus: ' + physicalCampus + '</li>';
          html += '</ul>';
          html += '<h3 class="admissions-info">' + 'Admissions Information' + '</h3>';
          html += '<ul class="admissions-info-list">'; //start admissions info list
          html += '<li class="admissions-info-item">Admission Rate: ' + admissionRate + '</li>';
          html += '';
          html += '</div>';
        }
        $('#results').html(html);
      }
    }); //end of ajax
  });
});
