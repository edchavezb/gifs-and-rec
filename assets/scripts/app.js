
var width = $(window).width()
console.log(width)

var pawnee = [
  {"fullname":"Leslie Knope", "name": "Leslie"}, 
  {"fullname":"Ron Swanson", "name": "Ron"},
  {"fullname":"Andy Dwyer", "name": "Andy"},
  {"fullname":"April Ludgate", "name": "April"},
  {"fullname":"Tom Haverford", "name": "Tom"},
  {"fullname":"Ann Perkins", "name": "Ann"},
  {"fullname":"Chris Traeger", "name": "Chris"},
  {"fullname":"Ben Wyatt", "name": "Ben"},
  {"fullname":"Donna Meagle", "name": "Donna"},
  {"fullname":"Jerry Gergich", "name": "Jerry"},
  {"fullname":"Craig Middlebrooks", "name": "Craig"},
  {"fullname":"Jean-Ralphio", "name": "J. Ralphio"},
  {"fullname":"Perd Hapley", "name": "P. Hapley"},
  {"fullname":"Lil Sebastian", "name": "Not a pony"},
]

var selected = [
  {"fullname":"Leslie Knope", "name": "Leslie"}, 
  {"fullname":"Ron Swanson", "name": "Ron"},
  {"fullname":"Andy Dwyer", "name": "Andy"},
  {"fullname":"April Ludgate", "name": "April"},
  {"fullname":"Tom Haverford", "name": "Tom"},
  {"fullname":"Chris Traeger", "name": "Chris"},
]

var checksNumber = 0;

$(".clear").hide();
$('.dropdown-menu').on('click', function(e) {
  e.stopPropagation();
});

function checksChecker() {
  if (checksNumber >= 6){
    $("input.form-check-input:not(:checked)").attr("disabled", true);
  }
  else $("input.form-check-input").removeAttr("disabled");
}

$(".first").find("label").text(pawnee[0].fullname);

for (var i = 1; i < pawnee.length; i++) {
  var newChar = $("<div>");
  newChar.html($(".first").html());
  newChar.addClass("form-group row mb-1 char-"+i);
  newChar.appendTo(".selector");
  newChar.find("label").text(pawnee[i].fullname);
  newChar.find("input").val(JSON.stringify(pawnee[i]));
  console.log(JSON.stringify(pawnee[i]));
}

$('input[type="checkbox"]').click(function(){
  if($(this).prop("checked") == true){
    checksNumber++
  }
  else if($(this).prop("checked") == false){
    checksNumber--
  }
  checksChecker();
});

function buttonRender() {
  $(".buttons-row").empty();
  for (var i = 0; i < selected.length; i++) {

  var myButton = $("<div>");
  var btnText = $("<span>");

  btnText.addClass("buttontext");
  btnText.text(selected[i].name);

  myButton.addClass("prbutton prcolor text-center");
  myButton.attr("data-char", selected[i].fullname);
  myButton.html(btnText);
 
  $(".buttons-row").append(myButton);

  console.log(selected[i]);
  }
}

buttonRender();

$(".clear").on("click", function() {
  $(".column").empty();
  $(".clear").hide();
});

$(".save").on("click", function() {
  event.preventDefault();
  selected.length = 0;
  $.each($("input[id='dropdownCheck']:checked"), function(){ 
    var selChar = $(this).val();      
    selected.push(JSON.parse(selChar));
  });
  console.log(selected);
  buttonRender();
  ajaxCall();
});

function ajaxCall(){
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
        charGif.attr("src", results[i].images.original_still.url);
        charGif.attr("data-still", results[i].images.original_still.url);
        charGif.attr("data-move", results[i].images.original.url);
        charGif.attr("data-state", "still");
        charGif.addClass("prgif mt-2");
        gifDiv.append(charGif);
        if (width < 768){
          $(".gifcol1").prepend(gifDiv);
        }
        else {
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
}

ajaxCall();

