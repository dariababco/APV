 // load a tile layer
 let map = new L.map('map', {
     center: [48.1403114185532, 11.5611056053238], // Location munich hbf
     zoom: 10
 });

 L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);


 // Use Leaflet to implement a D3 geometric transformation.
 var svg = d3.select(map.getPanes().overlayPane).append("svg"),
     g = svg.append("g").attr("class", "leaflet-zoom-hide");

 vis = d3.select("#map")
     .append("svg:svg")





 var toLine = d3.line()
     .curve(d3.curveBasis)
     .x(function (d) {
         return applyLatLngToLayer(d).x
     })
     .y(function (d) {
         return applyLatLngToLayer(d).y
     });

 d3.json("/routes/Lines_SBahn.geojson")
     .then(function (collection) {

         //stream transform. transforms geometry before passing it to
         // listener. Can be used in conjunction with d3.geo.path
         // to implement the transform. 
         let transform = d3.geoTransform({
             point: projectPoint
         })

         //d3.geo.path translates GeoJSON to SVG path codes.
         //essentially a path generator. In this case it's
         // a path generator referencing our custom "projection"
         // which is the Leaflet method latLngToLayerPoint inside
         // our function called projectPoint 
         let path = d3.geoPath().projection(transform);

         var feature = g.selectAll("path")
             .data(collection.features)
             .attr("class", "route")
             .enter().append("path")
             .attr("class", "lineConnect");
         map.on("zoomend", reset);
         console.log(collection.features.length)

         let bounds;
         let topLeft;
         let bottomRight;

         reset();

         // Reposition the SVG to cover the features.
         function reset() {
                 bounds = path.bounds(collection)
                 topLeft = bounds[0]
                 bottomRight = bounds[1]
             svg.attr("width", bottomRight[0] - topLeft[0])
                 .attr("height", bottomRight[1] - topLeft[1])
                 .style("left", topLeft[0] + "px")
                 .style("top", topLeft[1] + "px")
             g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
             feature.attr("d", path);
         }

         // Use Leaflet to implement a D3 geometric transformation.
         function projectPoint(x, y) {
             var point = map.latLngToLayerPoint(new L.LatLng(y, x));
             this.stream.point(point.x, point.y)

         };
         // Draw a red circle on the map:


         var targetPath = d3.selectAll('.lineConnect');
         console.log(targetPath)
         var pathNode = targetPath.node()
         console.log(pathNode)
         var pathLength = pathNode.getTotalLength();
         var circleRadii = [10];

         var circles = svg.selectAll("circle")
             .data(circleRadii)
             .enter()
             .append("circle");

         var circleAttributes = circles
             .attr("r", function (d) {
                 return d;
             })
             .attr("transform", function () {
                var p = pathNode.getPointAtLength(0)
                console.log(p)
                return "translate(" + [p.x+-topLeft[0], p.y +-topLeft[1]] + ")";
            })
             .style("fill", "green");

             duration = 10000;
             circles.transition()
                 .duration(duration)
                 .ease(d3.easeLinear)
                 .attrTween("transform", function (d, i) {
                 return function (t) {
                     var p = pathNode.getPointAtLength(pathLength*t);

                     return "translate(" + [p.x+-topLeft[0], p.y +-topLeft[1]] + ")";
                 }
             });

     })


 /* //add svgLayer to map to work with d3
    var svgLayer = L.svg();
    svgLayer.addTo(map);  */

 /*let routes = new L.LayerGroup();
 let test =  new L.GeoJSON.AJAX("/routes/test.geojson");
 let sBahn = new L.GeoJSON.AJAX("/routes/Lines_SBahn.geojson");
 let tram = new L.GeoJSON.AJAX("/routes/Lines_Tram.geojson"); 
 let uBahn = new L.GeoJSON.AJAX("/routes/Lines_UBahn.geojson");  */