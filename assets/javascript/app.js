
var pawnee = [
  {"fullname":"Leslie Knope", "name": "Leslie"}, 
  {"fullname":"Ron Swanson", "name": "Ron"},
  {"fullname":"Andy Dwyer", "name": "Andy"},
  {"fullname":"April Ludgate", "name": "April"},
  {"fullname":"Tom Haverford", "name": "Tom"},
  {"fullname":"Chris Traeger", "name": "Chris"}
]

var checksNumber = 0;

$(".clear").hide();
$('.dropdown-menu').on('click', function(e) {
  e.stopPropagation();
});

$('input[type="checkbox"]').click(function(){
  if($(this).prop("checked") == true){
    checksNumber++
  }
  else if($(this).prop("checked") == false){
    checksNumber--
  }
  checksChecker();
});

function checksChecker() {
  if (checksNumber >= 6){
    $("input.form-check-input:not(:checked)").attr("disabled", true);
  }
  else $("input.form-check-input").removeAttr("disabled");
}


for (var i = 0; i < pawnee.length; i++) {

  var myButton = $("<div>");
  var btnText = $("<span>");

  btnText.addClass("buttontext");
  btnText.text(pawnee[i].name);

  myButton.addClass("prbutton prcolor text-center mx-1");
  myButton.attr("data-char", pawnee[i].fullname);
  myButton.html(btnText);
 
  $(".buttons-row").append(myButton);

  console.log(pawnee[i]);
}

$(".prbutton").on("click", function() {
  $(".clear").show();
  var person = $(this).attr("data-char");
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + person + "&api_key=XViHxSYvhctVpSqIAOWeOS3Yb4qKYawo&limit=10";

  $.ajax({
    url: queryURL,
    method: "GET"
  })
  .then(function(response) {
    var results = response.data;
    console.log(results);

    for (var i = 0; i < results.length; i++) {
      var gifDiv = $("<div>");
      var charGif = $("<img>");
      var rating = results[i].rating;
      charGif.attr("src", results[i].images.original_still.url);
      charGif.attr("data-still", results[i].images.original_still.url);
      charGif.attr("data-move", results[i].images.original.url);
      charGif.attr("data-state", "still");
      charGif.addClass("prgif mt-2");
      gifDiv.append(charGif);
      if (i <= 2){
        $(".gifcol1").prepend(gifDiv);
      }
      else if (i <= 5){
        $(".gifcol2").prepend(gifDiv);
      }
      else if (i <= 8){
        $(".gifcol3").prepend(gifDiv);
      }
    }

    $(".prgif").on("click", function() {
      var state = $(this).attr("data-state");
      
      if (state === "still"){
        $(this).attr("src", $(this).attr("data-move"))
        $(this).attr("data-state", "move");
      }
    
      else if (state === "move") {
        $(this).attr("src", $(this).attr("data-still"))
        $(this).attr("data-state", "still");
      }
    });

  });

});

$(".clear").on("click", function() {
  $(".column").empty();
  $(".clear").hide();
});

