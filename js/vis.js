function startVis() {
  document.getElementById("startPrompt").remove();
  document.getElementById("startButtonCont").remove();
  addPrevAndNextButton();
  showSlideOne();
}

function addPrevAndNextButton() {
  document.getElementById("buttonsDiv").innerHTML = "<div id='prevButtonCont' class='button_cont' align='left'><a class='beautiful_button' href='#' target='_blank' rel='nofollow noopener' id='prevButton' onclick='prev(); return false;'>Previous Slide</a></div> <div id='nextButtonCont' class='button_cont' align='right'><a class='beautiful_button' href='#' target='_blank' rel='nofollow noopener' id='prevButton' onclick='next(); return false;'>Next Slide</a></div>"
}

function showSlideOne() {
  var data = [4,8,15,16,23,42];
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
