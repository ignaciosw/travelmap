<html>
	<head>
		<script src="http://code.jquery.com/jquery-latest.min.js"></script>
		<script src="js/jquery-jvectormap-2.0.3.min.js"></script>
		<script src="js/gdp-data.js"></script>
		<script src="js/jquery-jvectormap-world-mill-en.js"></script>
		<link rel="stylesheet" media="all" href="css/jquery-jvectormap-2.0.3.css" />
		<script>
			
		    $(document).ready(function () {
    			$('#world-map').vectorMap(wrld);
    			
    			var mapObj = $('#world-map').vectorMap('get', 'mapObject');

			    $('#countries').on('mouseover mouseout', 'a:first-child', function (event) {
			        // event.preventDefault();
			        var elem = event.target,
			            evtype = event.type,
			            cntrycode = findRegion(mapObj.regions, $(elem).text());
			
			        if (evtype === 'mouseover') {
			            mapObj.regions[cntrycode].element.setHovered(true);
			        } else {
			            mapObj.regions[cntrycode].element.setHovered(false);
			        };       
			    });
    		});
    		
			var wrld = {
			  map: 'world_mill_en',
			  regionStyle: {
			    hover: {
			        "fill": 'red'
			    }
			  }
			};
		</script>
	</head>
	<body>
		    <div id="world-map" style="width: 720px; height: 400px"></div>
	</body>
</html>

