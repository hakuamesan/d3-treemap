let width=1200;
let height = 800;

let format = d3.format(",d")
let color=d3.scaleOrdinal(d3.schemePaired);


let tile = d3.treemapSquarify;
const MOVIES ="https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
const GAMES="https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
const KICKSTARTER="https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

d3.json(MOVIES)
  .then( (data) => {

    treemap = data => d3.treemap()
    .tile(tile)
    .size([width, height])
    .padding(1)
//    .round(true)
  (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value))


    const root = treemap(data);


  let categories = root.leaves().map( (d) => d.data.category );
    let cat = new Set(categories);
    categories = [...cat];
  let legendCol = [];

    let legendData = {};
    for (let i in categories) {
      legendCol = color(i);
      let cat = categories[i];
      legendData[cat] = legendCol;
    }



var body = d3.select("body");
  
// Define the div for the tooltip
var tooltip = body.append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

var s = d3.select("#tree-map"),


  svg = s.append("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font", "12px sans-serif");


console.log(root.leaves());


  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  leaf.append("title")
      .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${'$'+format(d.value)}`)

  leaf.append("rect")
      .attr("id", d => (d.leafUid = document.getElementById("leaf")))
      .attr("class", "tile")
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d=> d.data.value)
      .attr("fill", d => { 
          while (d.depth > 1) 
            d = d.parent; 
          let col = color(d.data.name);
          legendData[d.data.name] = col;
        return col;
      })
      .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  leaf.append("clipPath")
      .attr("id", d => (d.clipUid = document.getElementById("clip")))
    .append("use")
//      .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
      .data(d => {
        let n = d.data.name.slice(0,25);
        n = n.split(/(?=[A-Z][a-z])|\s+/g);//.concat(format(d.value));
        return n;
      })
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .text(d => d);


leaf.on("mousemove", function(d) {  
        tooltip.style("opacity", .9); 
        tooltip.html(
          'Name: ' + d.data.name + 
          '<br>Category: ' + d.data.category + 
          '<br>Value: ' + '$'+format(d.data.value)
        )
        .attr("data-value", d.data.value)
        .style("left", (d3.event.pageX + 10) + "px") 
        .style("top", (d3.event.pageY - 28) + "px"); 
      })    
      .on("mouseout", function(d) { 
        tooltip.style("opacity", 0); 
      })


 //create legend
  const size = 15;

    
    console.log(legendData);
  var svg2 = d3.select('.legendSvg').append('svg').attr('class', 'svg2');
  
  var legend = svg2.selectAll('.legend')
    .data(categories)
    .enter().append('g')
    .attr('class', 'legend')
    .attr('id', 'legend')
    .attr('transform', (d, i) => {
      return 'translate(0, ' + (i * size) + ')'
    });
  
  legend
    .append('rect')
    .attr('transform', 'translate(10, 0)')
    .attr('class', 'legend-item')
    .attr('width', size)
    .attr('height', size)
//    .attr('fill', 'black')
    .attr('fill', (d, i) => legendData[d]);
  
  legend
    .append('text')
    .attr('transform', 'translate(27, 11)')
    .attr('class', 'legendTxt')
    .text((d) => d);
  

  return svg.node();


  })



