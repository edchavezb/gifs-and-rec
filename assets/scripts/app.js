var screenWidth = $(window).width()
var touchTimer;
var touchLength = 0;
var modalVisible = false;
var modal = document.getElementById("myModal");
var favorites = localStorage.getItem("favoriteGifs") !== null ? JSON.parse(localStorage.getItem("favoriteGifs")) : []
console.log(favorites)

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
  {"fullname":"Jean-Ralphio", "name": "J.Ralphio"},
  {"fullname":"Perd Hapley", "name": "P.Hapley"},
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
$("#favorites-guide").hide();
$('.dropdown-menu').on('click', function(e) {
  e.stopPropagation();
});

function checksChecker() {
  if (checksNumber >= 6){
    $("input.form-check-input:not(:checked)").attr("disabled", true);
  }
  else $("input.form-check-input").removeAttr("disabled");
}

const generateCheckboxes = () => {
  for (var i = 0; i < pawnee.length; i++) {
    var newChar = $("<div>");
    newChar.html($(".first").html());
    newChar.addClass("form-group row mb-1 char-"+i);
    newChar.appendTo(".selector");
    newChar.find("label").text(pawnee[i].fullname);
    newChar.find("input").val(JSON.stringify(pawnee[i]));
    console.log(JSON.stringify(pawnee[i]));
  }
  
  $(".first").hide();
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

generateCheckboxes();
buttonRender();

$(".clear").on("click", function() {
  $(".column").empty();
  $(".clear").hide();
});

$(".save").on("click", function(event) {
  event.preventDefault();
  selected.length = 0;
  $.each($("input[id='dropdownCheck']:checked"), function(){ 
    var selChar = $(this).val();
    console.log(selChar)     
    selected.push(JSON.parse(selChar));
  });
  console.log(selected);
  buttonRender();
});

$(document.body).on("click", ".prbutton", function() {
  $("#favorites-guide").hide();
  $(".clear").show();
  $(".favgif").remove();
  var randomOffset = Math.floor(Math.random() * 50);
  var person = $(this).attr("data-char");
  var queryURL = `https://api.giphy.com/v1/gifs/search?q=${person}&api_key=XViHxSYvhctVpSqIAOWeOS3Yb4qKYawo&limit=9&offset=${randomOffset}`;

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
      var favButton = $("<i>");
      gifDiv.addClass("gif-div")
      charGif.attr("src", results[i].images.original_still.url);
      charGif.attr("data-still", results[i].images.original_still.url);
      charGif.attr("data-move", results[i].images.original.url);
      charGif.attr("data-state", "still");
      charGif.addClass("prgif mt-2");
      favButton.addClass("fas fa-heart fav-button")
      //gifDiv.append(favButton);
      gifDiv.append(charGif);
      if (screenWidth < 768){
        $(".gifcol1").prepend(gifDiv);
      }
      else {
        if (i === 0 || i === 3 || i === 6){
          $(".gifcol1").prepend(gifDiv);
        }
        else if (i === 1 || i === 4 || i === 7){
          $(".gifcol2").prepend(gifDiv);
        }
        else if (i === 2 || i === 5 || i === 8){
          $(".gifcol3").prepend(gifDiv);
        }
      }
    }
  });
});

$(document.body).on("click", ".prgif", function() {
  clearTimeout(touchTimer);
  if (modalVisible === false){
    var state = $(this).attr("data-state");
    console.log(state)
    if (state === "still"){
      $(this).attr("src", $(this).attr("data-move"))
      $(this).attr("data-state", "move");
    }
    else if (state === "move") {
      $(this).attr("src", $(this).attr("data-still"))
      $(this).attr("data-state", "still");
    }
  }
}).on("mousedown touchstart", ".prgif", function() {
  var still = $(this).attr("data-still")
  var move = $(this).attr("data-move")
  touchTimer = setTimeout(function(){
    var whatsappUrl = screenWidth < 768 ? `whatsapp://send?text=${move}` : `https://wa.me/?text=${move}`
    $("#save-gif").attr("data-still", still).attr("data-move", move)
    $("#open-gif").attr("href", move)
    $("#wa-share").attr("href", whatsappUrl)
    console.log(favorites)
    modalVisible = true;
    $(".modal").show()
  },1000);
}).on("mouseup touchend", ".prgif", function() {
  clearTimeout(touchTimer);
  touchLength = 0;
}).on("touchmove", ".prgif", function() {
  touchLength++
  if(touchLength > 30){
    clearTimeout(touchTimer);
  }
});

$("#save-gif").on("click", function() {
  var still = $(this).attr("data-still")
  var move = $(this).attr("data-move")
  var gifSelectData = {
    gifStill: still,
    gifMove: move
  }
  favorites.push(gifSelectData)
  localStorage.setItem("favoriteGifs", JSON.stringify(favorites))
  favorites = JSON.parse(localStorage.getItem("favoriteGifs"))
  console.log(favorites)
  $(".modal").hide()
  modalVisible = false;
});

$("#no-save").on("click", function() {
  $(".modal").hide()
  modalVisible = false;
  clearTimeout(touchTimer);
});

window.onclick = function(event) {
  if (event.target == modal) {
    $(".modal").hide()
    modalVisible = false;
    clearTimeout(touchTimer);
  }
}

$("#show-favorites").on("click", function() {
  if (favorites.length){
    $(".column").empty();
    $(".clear").show();
    
    for (var i = 0; i < favorites.length; i++) {
      var gifDiv = $("<div>");
      var charGif = $("<img>");
      var favButton = $("<i>");
      gifDiv.addClass("gif-div")
      charGif.attr("src", favorites[i].gifStill);
      charGif.attr("data-still", favorites[i].gifStill);
      charGif.attr("data-move", favorites[i].gifMove);
      charGif.attr("data-state", "still");
      charGif.addClass("prgif favgif mt-2");
      favButton.addClass("fas fa-heart fav-button")
      //gifDiv.append(favButton);
      gifDiv.append(charGif);
      if (screenWidth < 768){
        $(".gifcol1").prepend(gifDiv);
      }
      else {
        if (i === 0 || i === 3 || i === 6){
          $(".gifcol1").prepend(gifDiv);
        }
        else if (i === 1 || i === 4 || i === 7){
          $(".gifcol2").prepend(gifDiv);
        }
        else if (i === 2 || i === 5 || i === 8){
          $(".gifcol3").prepend(gifDiv);
        }
      }
    }
  }
  else{
    $(".column").empty();
    $(".clear").hide();
    $("#favorites-guide").show();
  }
});

window.oncontextmenu = function(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};
