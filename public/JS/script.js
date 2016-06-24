var types_color = {
  "normal" : "#A8A878",
  "fire"  : "#F08030",
  "fighting"  : "#C03028",
  "water" : "#6890F0",
  "flying" : "#A890F0",
  "grass" : "#78C850",
  "poison" : "#A040A0",
  "electric" : "#F8D030",
  "ground" : "#E0C068",
  "psychic" : "#F85888",
  "rock" : "#B8A038",
  "ice" : "#98D8D8",
  "bug" : "#A8B820",
  "dragon" : "#7038F8",
  "ghost" : "#705898",
  "dark" : "#705848",
  "steel" : "#B8B8D0",
  "fairy" : "#EE99AC"
};

function Pokemon() {
  this.name;
  this.types;
  this.image;
  this.id;
  this.versions;
  this.height;
  this.weight;
  this.gif;
}

$(document).ready(function(){

  //Getting the nav highlighted for the correct link
  var title = document.URL.split('/').join(' ').trim().split(" ");
  title = title[title.length-1];
  var currentDir = document.querySelectorAll("[href='" + title + "']")[0];
  currentDir.style.textDecoration = "underline";
  currentDir.style.color = "#FF533F";

  console.log(currentDir);
  $("#search").on("submit",function(e){
    $(".modal-wrapper1").show();
    $(".loader").show();
    e.preventDefault();

    var name = $('input[name=name]').val();

    $.ajax({
      type: "GET",
      url: 'https://pokeapi.co/api/v2/pokemon/'+ name,
      success: function (response) {
        console.log(response);
        var pokemon = new Pokemon();

        //store pokemone id
        pokemon.id=response.id;
        document.getElementById("pokedex").innerHTML =  "#" + pokemon.id;
        console.log("Pokedex Id: " + pokemon.id);

        //store pokemon name
        pokemon.name = response.name[0].toUpperCase() + (response.name).slice(1);
		document.getElementById('Pokemon').innerHTML = "The Pokemon is: " + pokemon.name;
        document.getElementById("name").innerHTML = "Name: " + pokemon.name;
        console.log("Name: " + pokemon.name);

        //store pokemon height
        pokemon.height = response.height;
        document.getElementById("height").innerHTML = "Height: " + pokemon.height;
        console.log("Height: " + pokemon.height);

        //store pokemon weight
        pokemon.weight = response.weight;
        document.getElementById("weight").innerHTML = "Weight: " + pokemon.weight;
        console.log("Weight: " + pokemon.weight);
        
        //loop through and store pokemon type as an array
        var types =  [];
        for(index in response.types) {
          types.push(response.types[index].type.name);
        } 
        pokemon.types = types;
        var types_string = "";
        for(index in pokemon.types) {
          var type = pokemon.types[index];
          types_string += "<span style='background-color:" + types_color[type] + "'>" + type + "</span>"; 
        }
        document.getElementById("types").innerHTML = "Types: " + types_string;
        console.log("types: " + types);

        //loops through and store version the pokemon is in as an array
        var versions = [];
        for(index in response.game_indices) {
          versions.push(response.game_indices[index].version.name);
        }
        pokemon.versions = versions;
        console.log("Versions in: " + pokemon.versions);

    //store pokemon image
          pokemon.image = response.sprites.front_default;
          var img = new Image();
          img.src = pokemon.image;

        img.onload = function() {
          $(".loader").hide();
          //show our modal
        $(".modal-wrapper2").show();
        //add the .modal-on class to <body>
        $("body").addClass("modal-on"); 
        };

        $("#sideimage").html("");
        sideimage.appendChild(img);//insert the image into the modal

        $(".exit").click(function(e){
          e.preventDefault();
          //basically the opposite of activate
          $(".modal-wrapper1").hide();
          $(".modal-wrapper2").hide();
          $("body").removeClass("modal-on");
           document.getElementById('Pokemon').innerHTML = "Enter a Pokemon!";
         });
        },
        error: function(jqXHR, textStatus, errorThrown) {
          document.getElementById("Pokemon").innerHTML = "Wrong Name. Enter Again";
          $(".loader").hide(); //show our modal
          $(".modal-wrapper1").hide();
        }
      });
  });


});

//$.each(item, function(key,value){
  ////console.log("key: " + key);
  //console.log("value: " + value);
//})