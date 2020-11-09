const pawnee = [
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

let selected = [
  {"fullname":"Leslie Knope", "name": "Leslie"}, 
  {"fullname":"Ron Swanson", "name": "Ron"},
  {"fullname":"Andy Dwyer", "name": "Andy"},
  {"fullname":"April Ludgate", "name": "April"},
  {"fullname":"Tom Haverford", "name": "Tom"},
  {"fullname":"Chris Traeger", "name": "Chris"},
]

var screenWidth = $(window).width()
var checksNumber = 0;

// Variables are declared to control the longpress action on a gif
var touchTimer;
var slideLength = 0;

// Variables for the longpress modal
var modalVisible = false;
var modal = document.getElementById("myModal");

// A favorites array is retrieved from local storage if it exists
var favorites = localStorage.getItem("favoriteGifs") !== null ? JSON.parse(localStorage.getItem("favoriteGifs")) : []


// Generates buttons from the selected character array
const buttonRender = () => {

  // Clears all buttons previously added buttons
  $(".buttons-row").empty();

  // Cycles through the selected characters array and generates a button for each
  for (var i = 0; i < selected.length; i++) {
    var myButton = $("<div>");
    var btnText = $("<span>");

    // Character name is added to button text
    btnText.addClass("buttontext");
    btnText.text(selected[i].name);

    // Classes and character data are added to the button
    myButton.addClass("prbutton prcolor text-center");
    myButton.attr("data-char", selected[i].fullname);
    myButton.html(btnText);
    
    // Button is added to the buttons row
    $(".buttons-row").append(myButton);
  }
}

// Generates checkboxes for the selection menu from the pawnee array defined above
const generateCheckboxes = () => {

  // Cycles through the array of all characters and creates checkboxes for each
  for (var i = 0; i < pawnee.length; i++) {
    var newChar = $("<div>");
    newChar.html($("#template").html()); // Copies the template checkbox into the new div
    newChar.addClass("form-group row mb-1");
    newChar.appendTo(".selector");
    newChar.find("input").attr('id', "char-"+i)
    newChar.find("label").text(pawnee[i].fullname);
    newChar.find("label").attr('for', 'char-'+i);  // Checkbox text is added from character array
    newChar.find("input").val(JSON.stringify(pawnee[i])); // Checkbox value is added from character array
  }
  $("#template").hide();
}

// Buttons and checkboxes are generated on page load
buttonRender();
generateCheckboxes();

// Generates gifs from a passed gif array and distributes them in columns
const generateGifs = (gifArray, favorite) => {
  for (var i = 0; i < gifArray.length; i++) {

    // If the favorite parameter is true, gif URLs are extracted from a local storage entry
    const still = favorite ? gifArray[i].gifStill : gifArray[i].images.original_still.url;
    const move = favorite ? gifArray[i].gifMove : gifArray[i].images.original.url;
    const favClass = favorite ? "favgif" : "";

    var gifDiv = $("<div>");
    var charGif = $("<img>");
    gifDiv.addClass("gif-div")

    // The URLs for still and animated gifs are stored in an image attribute
    charGif.attr("src", still);
    charGif.attr("data-still", still);
    charGif.attr("data-move", move);

    // The current state of the gif is stored in an attribute as well
    charGif.attr("data-state", "still");
    charGif.addClass(favClass + " prgif mt-2");
    gifDiv.append(charGif);

    // The gifs will be placed in a single column if the app is run on a small viewport
    if (screenWidth < 768){
      $(".gifcol1").prepend(gifDiv);
    }

    // Otherwise, gifs will be placed evenly in three columns
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

// A simple checker function to disable checkboxes once the user has selected 6 characters
const checksChecker = () => {
  if (checksNumber >= 6){
    $("input.form-check-input:not(:checked)").attr("disabled", true);
  }
  else $("input.form-check-input").removeAttr("disabled");
}

// Checking a checkbox will increase a counter and perform a check, disabling checkboxes when counter is greater than 6
$('input[type=checkbox').unbind('change').change(function(){
  if($(this).prop("checked") == true){
    checksNumber++
  }
  else if($(this).prop("checked") == false){
    checksNumber--
  }
  checksChecker();
});

// Save character selection button
$(".save").on("click", event => {
  event.preventDefault();
  selected.length = 0; // Clears original selection of characters

  // Reintroduce selected characters to the selected array
  $.each($("input[class='form-check-input']:checked"), function(){ 
    var selChar = $(this).val(); 
    selected.push(JSON.parse(selChar));
  });
  buttonRender(); // Regenerates buttons based on character selection
});


// Displays favorite gifs when heart icon is pressed
$("#show-favorites").on("click", function() {
  if (favorites.length){
    $(".column").empty();
    $(".clear").show();
    generateGifs (favorites, true);
  }

  // If no favorites are found, display favorite saving instructions
  else{
    $(".column").empty();
    $(".clear").hide();
    $("#favorites-guide").show();
  }
});


// Controls the action when clicking on a character's button to display gifs
$(document.body).on("click", ".prbutton", function() {
  $("#favorites-guide").hide(); // Favorite instructions are hidden
  $(".favgif").remove(); // Favorite gifs on screen are removed
  $(".clear").show(); // Clear button is displayed

  // A random offset for the AJAX query is created to get a different set of gifs with every click
  var randomOffset = Math.floor(Math.random() * 50);

  // The character data is extracted from a button attribute
  var person = $(this).attr("data-char");

  // Query string is formed with data
  var queryURL = `https://api.giphy.com/v1/gifs/search?q=${person}&api_key=XViHxSYvhctVpSqIAOWeOS3Yb4qKYawo&limit=9&offset=${randomOffset}`;

  // Query the Giphy API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
  .then(function(response) {
    var results = response.data;
    generateGifs(results, false); // Genereate gifs from response data
  });
});


// Controls the action when clicking or longpressing a gif
$(document.body).on("click", ".prgif", function() {
  clearTimeout(touchTimer); // Clear any previous longpress timers
  if (modalVisible === false){ 
    var state = $(this).attr("data-state");

    // Switches the state of the gif from still to animated and vice versa
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

  // Display modal with gif data if a one second longpress occurs
  touchTimer = setTimeout(function(){

    //  A different whatsapp url is used depending on viewport size
    var whatsappUrl = screenWidth < 768 ? `whatsapp://send?text=${move}` : `https://wa.me/?text=${move}`

    // Still and animated URLs are attached to the save to favorites <a> tag
    $("#save-gif").attr("data-still", still).attr("data-move", move)

    // Animated link to giphy is attached to open gif <a> tag
    $("#open-gif").attr("href", move)

    // Whatsapp link is attached to share <a> tag
    $("#wa-share").attr("href", whatsappUrl)
    modalVisible = true;
    $(".modal").show()
  },1000);
}).on("mouseup touchend", ".prgif", function() {
  clearTimeout(touchTimer); // Cancel the longpress action if touch ends before one second
  touchLength = 0;
}).on("touchmove", ".prgif", function() {
  slideLength++
  if(slideLength > 30){
    clearTimeout(touchTimer); // If finger or cursor is slid for more than 30 pixels, cancel the longpress action
  }
});


// Modal save button: Saves gif data in local storage, hides modal
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
  $(".modal").hide()
  modalVisible = false;
});

// Close modal by pressing anywhere outside menu
window.onclick = function(event) {
  if (event.target == modal) {
    $(".modal").hide()
    modalVisible = false;
    clearTimeout(touchTimer);
  }
}

// Clear all gifs on the screen
$(".clear").on("click", () => {
  $(".column").empty();
  $(".clear").hide();
});

// Disable context menu so it does not interfere with longpress
$('body').on('contextmenu', function(){return false;});

// Hide unnecesary UI items on page load
$(".clear").hide();
$("#favorites-guide").hide();

// Prevents dropdown from closing when clicking inside
$('.dropdown-menu').on('click', function(e) {
  e.stopPropagation();
});