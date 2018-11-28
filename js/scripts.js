$(document).ready(function(){
  console.log('scripts loaded');

  var url;
  var data;
  var html = '';
  var i;

  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: url,
    data: data,
    async: true,
    success: function(nations){
    }
  }); //end of ajax
});
