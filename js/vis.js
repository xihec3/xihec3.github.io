let sports = ['aquatics', 'archery', 'athletics', 'badminton', 'basketball', 'boxing', 'canoe', 'cycling', 'equestrian', 'fencing', 'football', 'golf', 'gymnastics', 'handball', 'hockey', 'judo', 'modern', 'pentathlon', 'rowing', 'rugby', 'sevens', 'sailing', 'shooting', 'table', 'tennis', 'taekwondo', 'tennis', 'triathlon', 'volleyball', 'weightlifting', 'wrestling']

let slide_num = 0;
let first_time = true;

let sport_to_athletes = new Map();
let selected_athletes = [];

var margin = {top: 25, left: 100};
var width = 600;
var height = 500;

function init() {
  d3.csv("https://raw.githubusercontent.com/flother/rio2016/master/athletes.csv", function(data) {
    for (var i = 0; i < data.length; i++) {
        if (sport_to_athletes.has(data[i].sport)) {
          sport_to_athletes.get(data[i].sport).push(data[i]);
        } else {
          sport_to_athletes.set(data[i].sport, [data[i]]);
        }
        selected_athletes.push(data[i]);
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
  document.getElementById("selectDiv").innerHTML = "<p>Sports to include:</p><ul>"
  sports.forEach((sport, i) => document.getElementById("selectDiv").innerHTML += "<li><input type='checkbox' class='sport_cbx' onclick='updateSelect()' checked value='".concat(sport, "'>", sport, "</li>"));
  document.getElementById("selectDiv").innerHTML += "</ul>"
}

function updateSelect() {
  selected_athletes = [];
  var checkboxes = document.getElementsByClassName('sport_cbx');
  for (var i=0; i<checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      if (sport_to_athletes.has(checkboxes[i].value)) {
        const athletes = sport_to_athletes.get(checkboxes[i].value);
        selected_athletes.push(...athletes);
      }
    }
  }
  console.log("Number of selected athletes: ".concat(selected_athletes.length))
  showSlide();
}

function addMedal(data) {
  return parseInt(data.gold)+parseInt(data.silver)+parseInt(data.bronze);
}

function showSlide() {
  if (slide_num == 0) {
    clear();
    document.getElementById("textDiv").innerHTML = "<h4>Who won the most medals?</h4><p>The history high is Phllip.</p>";
    selected_athletes.sort(function(a,b){return addMedal(b)- addMedal(a);});
    show_athletes = selected_athletes.slice(0, 20);
    show_athlete_names = show_athletes.map(d=>d.name);
    show_athlete_count = show_athletes.map(d=>addMedal(d));
    max_number = Math.max(...show_athlete_count);

    svg = d3.select("svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    y = d3.scaleBand().domain(show_athlete_names).range([0, height]).padding(0.1);
    console.log(y.bandwidth())
    svg.append("g")
      .call(d3.axisLeft(y).tickSizeOuter(0));

    x = d3.scaleLinear().domain([0,max_number]).range([0, width]);
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x).ticks(max_number+1).tickFormat(d3.format("d")));
    
    var subgroups = ["gold", "silver", "bronze"];
    var color = d3.scaleOrdinal()
                  .domain(subgroups)
                  .range(['#fee101','#cccccc','#a05822']);
    var stackedData = d3.stack()
                        .keys(subgroups)
                        (show_athletes)
    svg.append("g")
       .selectAll("g")
       .data(stackedData) // Enter in the stack data = loop athlete per athlete
       .enter().append("g")
         .attr("fill", d => color(d.key))
         .selectAll("rect")
         .data(function(d) {console.log(d); return d;} )  // // enter a second time = loop subgroup per subgroup
         .enter().append("rect")
         .attr("x", d => x(d[0]) + 2)
         .attr("y", d => y(d.data.name))
         .attr("height", y.bandwidth())
         .attr("width", d => x(d[1]) - x(d[0]));

  } else {
    console.log("unimplemented");
  } 
}

function clear() {
  d3.select('svg').selectAll("*").remove();
}

function prev() {
  if (slide_num == 1 || slide_num == 2) {
    slide_num -= 1;
    first_time = true;
    showSlide();
  } else {
    alert("You are viewing the first slide.");
  }
}

function next() {
  if (slide_num == 0 || slide_num == 1) {
    slide_num += 1;
    first_time = true;
    showSlide();
  } else {
    alert("You are viewing the last slide.");
  }
}
