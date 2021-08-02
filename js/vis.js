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
  updateSelect();
}

function addPrevAndNextButton() {
  document.getElementById("buttonsDiv").innerHTML = "<div id='prevButtonCont' class='button_cont' align='left'><a class='beautiful_button' href='#' target='_blank' rel='nofollow noopener' id='prevButton' onclick='prev(); return false;'>Previous Slide</a></div> <div id='nextButtonCont' class='button_cont' align='right'><a class='beautiful_button' href='#' target='_blank' rel='nofollow noopener' id='prevButton' onclick='next(); return false;'>Next Slide</a></div>"
}

function addCheckboxes() {
  document.getElementById("selectDiv").innerHTML = "<p>Select sports to include:</p><ul>"
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
    document.getElementById("textDiv").innerHTML = "<h4>Who won the most medals?</h4><p>In 2016 Olympics, Swimmer Michael Phelps won the 6 total medals on his journey to becoming the most decorated Olympian. He also holds the all-time records for Olympic gold medals with 23 gold medal winning.</p><p>Out of the 11,238 athletes participating in 306 events, 1857 got at least one medal.</p>"
    selected_athletes.sort(function(a,b){return addMedal(b)- addMedal(a);});
    show_athletes = selected_athletes.slice(0, 20);
    show_athlete_names = show_athletes.map(d=>d.name);
    show_athlete_count = show_athletes.map(d=>addMedal(d));
    max_number = Math.max(...show_athlete_count);

    svg = d3.select("svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    y = d3.scaleBand().domain(show_athlete_names).range([0, height]).padding(0.1);
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
         .data(function(d) { return d;} )  // // enter a second time = loop subgroup per subgroup
         .enter().append("rect")
         .attr("x", d => x(d[0]) + 2)
         .attr("y", d => y(d.data.name))
         .attr("height", y.bandwidth())
         .attr("width", d => x(d[1]) - x(d[0]));

    if (first_time) {
      document.getElementById("graph").innerHTML += "<g><path class='annotation_line' d='M 480 400 L 650 400 M 410 410 L 480 400'/><text x='485' y='392' fill='black'>'Unluckiness?'</text><text x='485' y='418' fill='black'>Grasse got 3 medals but</text><text x='485' y='433' fill='black'>no gold medal.</text></g>" 
      first_time = false;
    }
  } else if (slide_num == 1) {
    clear();
    document.getElementById("textDiv").innerHTML = "<h4>What are the prime years age Who won the most medals?</h4><p>In 2016 Olympics, Swimmer Michael Phelps won the 6 total medals on his journey to becoming the most decorated Olympian. He also holds the all-time records for Olympic gold medals with 23 gold medal winning.</p><p>Out of the 11,238 athletes participating in 306 events, 1857 got at least one medal.</p>"
    selected_athletes.sort(function(a,b){return addMedal(b)- addMedal(a);});
    show_athletes = selected_athletes.slice(0, 20);
    show_athlete_names = show_athletes.map(d=>d.name);
    show_athlete_count = show_athletes.map(d=>addMedal(d));
    max_number = Math.max(...show_athlete_count);

    svg = d3.select("svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    y = d3.scaleBand().domain(show_athlete_names).range([0, height]).padding(0.1);
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
         .data(function(d) { return d;} )  // // enter a second time = loop subgroup per subgroup
         .enter().append("rect")
         .attr("x", d => x(d[0]) + 2)
         .attr("y", d => y(d.data.name))
         .attr("height", y.bandwidth())
         .attr("width", d => x(d[1]) - x(d[0]));

    if (first_time) {
      document.getElementById("graph").innerHTML += "<g><path class='annotation_line' d='M 410 340 L 480 400 L 650 400 M 410 410 L 480 400 M 410 458 L 480 400'/><text x='485' y='392' fill='black'>'Unluckiness'</text><text x='485' y='418' fill='black'>Some athletes got 3 medals</text><text x='485' y='433' fill='black'>but no gold medal.</text></g>" 
      first_time = false;
    }
  } else if (slide_num == 2) {
    clear();
    document.getElementById("textDiv").innerHTML = "<h4>Did nationality affect medal winning?</h4><p>Athletes from 207 countries participated in the 2016 Summer Olympics. Athletes from 87 countries won medals. The U.S. led the medal table, winning 121 medals.</p><p>The chart on the right shows the average number of medals won per athlete for top 20 countries.</p>"
    var country_map = new Map();
    for (var i = 0; i < selected_athletes.length; i++) {
        ctr = selected_athletes[i].nationality;
        if (country_map.has(ctr)) {
          existing = country_map.get(ctr);
          country_map.set(ctr, {cnt: existing.cnt+1, gold: existing.gold + parseInt(selected_athletes[i].gold), silver: existing.silver + parseInt(selected_athletes[i].silver), bronze: existing.bronze + parseInt(selected_athletes[i].bronze)});
        } else {
          country_map.set(ctr, {cnt: 1, gold: parseInt(selected_athletes[i].gold), silver: parseInt(selected_athletes[i].silver), bronze: parseInt(selected_athletes[i].bronze)});
        }
    }

    avg = [];
    country_map.forEach((value, key) => 
{
  avg.push({name: key, gold: value.gold/value.cnt, silver: value.silver/value.cnt, bronze: value.bronze/value.cnt});
});

    avg.sort(function(a,b){return (b.gold+b.silver+b.bronze) - (a.gold+a.silver+a.bronze);});
    show_countries = avg.slice(0, 20);
    show_country_names = show_countries.map(d=>d.name);
    show_country_avg = show_countries.map(d=>d.gold+d.silver+d.bronze);
    max_number = Math.max(...show_country_avg);

    svg = d3.select("svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    y = d3.scaleBand().domain(show_country_names).range([0, height]).padding(0.1);
    svg.append("g")
      .call(d3.axisLeft(y).tickSizeOuter(0));

    x = d3.scaleLinear().domain([0,max_number]).range([0, width]);
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));
    
    var subgroups = ["gold", "silver", "bronze"];
    var color = d3.scaleOrdinal()
                  .domain(subgroups)
                  .range(['#fee101','#cccccc','#a05822']);
    var stackedData = d3.stack()
                        .keys(subgroups)
                        (show_countries)
    svg.append("g")
       .selectAll("g")
       .data(stackedData) // Enter in the stack data = loop athlete per athlete
       .enter().append("g")
         .attr("fill", d => color(d.key))
         .selectAll("rect")
         .data(function(d) {return d;} )  // // enter a second time = loop subgroup per subgroup
         .enter().append("rect")
         .attr("x", d => x(d[0]) + 2)
         .attr("y", d => y(d.data.name))
         .attr("height", y.bandwidth())
         .attr("width", d => x(d[1]) - x(d[0]));

    if (first_time) {
      document.getElementById("graph").innerHTML += "<g><path class='annotation_line' d='M 460 240 L 530 290 L 700 290 M 390 340 L 530 290'/><text x='535' y='282' fill='black'>'Bronze Only'</text><text x='535' y='308' fill='black'>Norway got 4 bronze medals;</text><text x='535' y='322' fill='black'>Nigeria got 1 bronze medal.</text></g>" 
      first_time = false;
    }
  }  
}

function clear() {
  d3.select('svg').selectAll("*").remove();
  document.getElementById("textDiv").innerHTML = ""; 
}

function prev() {
  if (slide_num == 1 || slide_num == 2) {
    slide_num -= 1;
    first_time = true;
    const checkboxes = document.getElementsByClassName('sport_cbx');
    for (var i=0; i<checkboxes.length; i++) {
      checkboxes[i].checked = true;
    }
    updateSelect();
  } else {
    alert("You are viewing the first slide.");
  }
}

function next() {
  if (slide_num == 0 || slide_num == 1) {
    slide_num += 1;
    first_time = true;
    const checkboxes = document.getElementsByClassName('sport_cbx');
    for (var i=0; i<checkboxes.length; i++) {
      checkboxes[i].checked = true;
    }
    updateSelect();
  } else {
    alert("You are viewing the last slide.");
  }
}
