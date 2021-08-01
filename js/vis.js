function startVis() {
  document.getElementById("startButton").remove();
  const graph = document.createElement("svg");
  graph.setAttribute("width", 350);
  graph.setAttribute("height", 200);
  document.body.appendChild(graph);
  showSlideOne();
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
