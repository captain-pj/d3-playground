(function() {
var app = {
	// manual vanilla js tab function for demonstration purposes
	tabNavigation : function() {
		// variables
		var tabs, navtabs;
		// Get tab elements
		navtabs = document.getElementsByClassName('navtab');
		tabs = document.getElementsByClassName('tabcontent');

		for (let i = 0; i < navtabs.length; i++) {
			navtabs[i].onclick = function(e) {
				e.preventDefault();
				// remove active class from all tab panels and add to matching div
				for (let j = 0; j < tabs.length; j++) {
					tabs[j].className = tabs[j].className.replace(' active', ''); 
				}
				var tablink = this.getAttribute('href').replace('#', '');
				document.getElementById(tablink).className += ' active'; 

				// same treatment for the navtabs classes
				for (let k = 0; k < navtabs.length; k++) {
					navtabs[k].className = navtabs[k].className.replace(' active', ''); 
				}
				this.className += ' active';
			}
		}
	},

	// simple bar chart example
	barChart : function() {
		// let's grab some open data
		var meteoriteUrl = 'https://data.nasa.gov/resource/y77d-th95.json',
				chartTab = document.getElementById('bars'),
				activeClass = 'active';

		if(chartTab.classList.contains('active')) {
			buildChart();
		} else {
			d3.select('#bars svg').remove();
		}

		function buildChart() {
			d3.json(meteoriteUrl, function (data) {
				// we only care about the mass for this visualization
				var map = data.map(function(d) { return parseInt(d.mass/1000); });
				// remove the outliers - 2.5% off either end - todo: make this zoomable so there is no data
				map.sort(function(a,b){return a-b});
				var l = map.length,
						low = Math.round(l * 0.025),
						high = l - low,
						map2 = map.slice(low,high);

				var formatCount = d3.format(',.0f');
				var svg = d3.select('#bars svg'),
						margin = {top: 10, right: 30, bottom: 30, left: 30},
						width = +svg.attr('width') - margin.left - margin.right,
						height = +svg.attr('height') - margin.top - margin.bottom,
						g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

				var x = d3.scaleLinear()
						.domain([d3.min(map2),d3.max(map2)])
						.rangeRound([0, width]);

				var bins = d3.histogram()
						.domain(x.domain())
						.thresholds(x.ticks(20))
						(map2);

				var y = d3.scaleLinear()
						.domain([0, d3.max(bins, function(d) { return d.length; })])
						.range([height, 0]);

				var bar = svg.selectAll('.bar')
						.data(bins)
						.enter().append('g')
						.attr('class', 'bar')
						.attr('transform', function(d) { return 'translate(' + x(d.x0) + ',0)'; });

				bar.append('rect')
					.attr('x', 1)
					.attr('y', height)
					.attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
					.attr('height', 0)
					.transition()
						.delay(function(d,i) { return i *50; })
						.duration(1500)
						.attr('y', function(d) { return y(d.length); })
						.attr('height', function(d) { return height - y(d.length); });
				bar.append('text')
					.attr('dy', '.75em')
					.attr('y', 6)
					.attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
					.attr('text-anchor', 'middle')
					.text(function(d) { return formatCount(d.length); });
				svg.append('g')
					.attr('class', 'axis axis--x')
					.attr('transform', 'translate(0,' + height + ')')
					.call(d3.axisBottom(x));
			});
		}
	}	
};
app.tabNavigation();
app.barChart();
})();


// for (var i = 0; i < tabLinks.length; i++) { 
//   tabLinks[i].onclick = function() {
//     var target = this.getAttribute('href').replace('#', '');
//     var sections = document.querySelectorAll('section.tab-content');
    
//     for(var j=0; j < sections.length; j++) {
//       sections[j].style.display = 'none';
//     }
    
//     document.getElementById(target).style.display = 'block';
    
//     for(var k=0; k < tabLinks.length; k++) {
//       tabLinks[k].removeAttribute('class');
//     }
    
//     this.setAttribute('class', 'is-active');
    
//     return false;
//   }
// };