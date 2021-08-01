let sports = ['aquatics', 'archery', 'athletics', 'badminton', 'basketball', 'boxing', 'canoe', 'cycling', 'equestrian', 'fencing', 'football', 'golf', 'gymnastics', 'handball', 'hockey', 'judo', 'modern', 'pentathlon', 'rowing', 'rugby', 'sevens', 'sailing', 'shooting', 'table', 'tennis', 'taekwondo', 'tennis', 'triathlon', 'volleyball', 'weightlifting', 'wrestling']

let slide_num = 0;

let athletes = new Map();

function init() {
  d3.csv("https://raw.githubusercontent.com/flother/rio2016/master/athletes.csv", function(data) {
    for (var i = 0; i < data.length; i++) {
        // console.log(data[i].name);
    }
    console.log("Data loaded");
    document.getElementById("startButtonContCont").innerHTML = "<div id='startButtonCont' class='button_cont' align='center'><a class='beautiful_button' href='#' target='_blank' rel='nofollow noopener' id='startButton' onclick='startVis(); return false;'>Start</a></div>"
  }
  );
}

function startVis() {
  document.getElementById("startPrompt").remove();
  document.getElementById("startButtonCont").remove();
  addPrevAndNextButton();
  document.getElementById("textDiv").style.border = "2px solid";
  document.getElementById("textDiv").style.width = "150px";
  document.getElementById("graphDiv").style.border = "2px solid";
  document.getElementById("graphDiv").style.borderLeftStyle = "none";
  document.getElementById("graphDiv").style.width = "750px";
  document.getElementById("selectDiv").style.border = "2px solid";
  document.getElementById("selectDiv").style.borderLeftStyle = "none";
  document.getElementById("selectDiv").style.width = "150px";
  addCheckboxes();
  slide_num = 0;
  showSlide();
}

function addPrevAndNextButton() {
  document.getElementById("buttonsDiv").innerHTML = "<div id='prevButtonCont' class='button_cont' align='left'><a class='beautiful_button' href='#' target='_blank' rel='nofollow noopener' id='prevButton' onclick='prev(); return false;'>Previous Slide</a></div> <div id='nextButtonCont' class='button_cont' align='right'><a class='beautiful_button' href='#' target='_blank' rel='nofollow noopener' id='prevButton' onclick='next(); return false;'>Next Slide</a></div>"
}

function addCheckboxes() {
  document.getElementById("selectDiv").innerHTML = "<p>Sports to include:</p> <ul>"
  sports.forEach((sport, i) => document.getElementById("selectDiv").innerHTML += "<li><input type='checkbox' onclick='updateSelect()' checked> ".concat(sport, "</li>"));
  document.getElementById("selectDiv").innerHTML += "</ul>"
}

function updateSelect() {
  console.log("1111");
}

function showSlide() {
  var data = [4,8,15,16,23,42];
  document.getElementById("textDiv").innerHTML = "Who won?"
  d3.select('svg')
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", "50")
    .attr("cy", (d, i) => (i+1) * 50)
    .attr("r", (d) => d)
}

function clear() {
  d3.select('svg').html = ""
}

function prev() {

}

function next() {

}
