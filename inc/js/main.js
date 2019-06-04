var map = null;
var markers = [];
var actinfo = null;		//Active info window
var updateTime = 2000;	//Update time, miliseconds
var panorama;

var units = [];
var clockUpdTime = 800;
var popups = [];

var vbuffer = true;
var gauge_size = 40;	//gauge size in pixels

$(document).ready(function() {
	//Actualización de reloj
	setInterval(updateClock(), clockUpdTime);
	//Actualización de tabla de información de objetivos
	updatePage(true);
	//init_gauges();
	init_map();
});

function updatePage(isInit) {
	var datarequest, lights;

	datarequest = createAjaxRequest();
	datarequest.onreadystatechange = function() {
		if (datarequest.readyState == 4 && datarequest.status == 200) {
			var jUnits = JSON.parse(datarequest.responseText);
			var new_popups = [];
			if(jUnits.length>0) document.getElementById("popup-container").innerHTML = "";
			for (var i = 0; i<jUnits.length; i++) {
  				putMarker(i, jUnits[i].id, jUnits[i].lat, jUnits[i].lon, 'images/meter-o.png');
  				new_popups.push(createPopup(i, jUnits[i]));
			}

			for(var i = 0; i<new_popups.length; i++){
				map.removeOverlay(popups[new_popups[i].getId()]);
				popups[new_popups[i].getId()] = new_popups[i];
				map.addOverlay(popups[new_popups[i].getId()]);
				if(typeof(popups[new_popups[i].getId()].getPosition())!==typeof(undefined)){
					var pos = popups[new_popups[i].getId()].getPosition();
					popups[new_popups[i].getId()].setPosition(pos);
				}
			}			
			
			if(isInit) resizeView();

			setTimeout(updatePage, updateTime, false);
		}
	};
	datarequest.open("GET", "inc/punits.php", true);
	datarequest.send();
}

function getEncodedId(id){
	return encodeURIComponent(id);
}

function createPopup(id, jUnit){
	var enc_id = getEncodedId(id);
	var bodypop = '<div id="popup-'+enc_id+'" class="ol-popup"> \
				<a href="javascript:closePopup('+enc_id+')" id="popup-'+enc_id+'-closer" class="ol-popup-closer"></a> \
					<div>\
						<div class="panel" style="position:relative;">\
							<div class="panel">\
								<span>Name:<span><span class="panel-label" id="popup-'+enc_id+'panel-name">----</span><br>\
								<span>Time:<span><span class="panel-label" id="popup-'+enc_id+'panel-time">----</span><br>\
								<span>INT:&nbsp;<span><span class="panel-label" id="popup-'+enc_id+'panel-int">----</span><br>\
								<span>Flag:<span><span class="panel-label" id="popup-'+enc_id+'panel-flag">----</span>\
							</div><br>\
		\
							<div class="panel">\
								<span>Lat:<span><span class="panel-label" id="popup-'+enc_id+'panel-lat">----</span><br>\
								<span>Lon:<span><span class="panel-label" id="popup-'+enc_id+'panel-lon">----</span>\
							</div><br>\
\
							<div class="panel">Signal 0<div id="popup-'+enc_id+'sgn0GaugeContainer" class="gauge-container"></div><span class="lcd" name="popup-'+enc_id+'lcdv">&nbsp;0&nbsp;</span></div>\
							<div class="panel">Signal 1<div id="popup-'+enc_id+'sgn1GaugeContainer" class="gauge-container"></div><span class="lcd" name="popup-'+enc_id+'lcdv">&nbsp;0&nbsp;</span></div><br>\
							<div class="panel">Signal 2<div id="popup-'+enc_id+'sgn2GaugeContainer" class="gauge-container"></div><span class="lcd" name="popup-'+enc_id+'lcdv">&nbsp;0&nbsp;</span></div>\
							<div class="panel">Signal 3<div id="popup-'+enc_id+'sgn3GaugeContainer" class="gauge-container"></div><span class="lcd" name="popup-'+enc_id+'lcdv">&nbsp;0&nbsp;</span></div><br>\
					</div>\
			</div> ';
	var container = document.getElementById("popup-container"); 
	var node = document.createElement("DIV");
	node.innerHTML = bodypop;
	container.appendChild(node);

	document.getElementById("popup-"+enc_id+"panel-name").innerHTML = jUnit.id;
	document.getElementById("popup-"+enc_id+"panel-time").innerHTML = jUnit.time;
	document.getElementById("popup-"+enc_id+"panel-int").innerHTML = jUnit.int;
	document.getElementById("popup-"+enc_id+"panel-flag").innerHTML = jUnit.flag;
	document.getElementById("popup-"+enc_id+"panel-lat").innerHTML = Number(jUnit.lat).toFixed(6);
	document.getElementById("popup-"+enc_id+"panel-lon").innerHTML = Number(jUnit.lon).toFixed(6);

	//var i = 0;
	//for (var key in getGaugesCollection()){
	//	var value = Number(jUnit.signal[i]);
	//	getGauge(key).redraw(value);
	//	document.getElementsByName("popup-"+enc_id+"lcdv")[i].innerHTML = " "+value.toFixed(3)+" ";
	//	i++;
	//}

	for(var i = 0; i<jUnit.signal.length; i++){
		var gauge_id = "gauge-"+enc_id;
		var level = jUnit.signal[i];
		document.getElementById('popup-'+enc_id+'sgn'+i+'GaugeContainer').innerHTML="";
		createGauge('popup-'+enc_id+'sgn'+i+'GaugeContainer', gauge_id, "Signal_"+i, gauge_size, 0, 100);
		getGauge(gauge_id).redraw(level);
		document.getElementsByName("popup-"+enc_id+"lcdv")[i].innerHTML = " "+Number(level).toFixed(3)+" ";
	}

	var pos = undefined;
	if(typeof(popups[enc_id]) !== typeof(undefined) && typeof(popups[enc_id].getPosition())!==typeof(undefined)) 
		//pos = ol.proj.fromLonLat([jUnit.lon, jUnit.lat]);
		pos = popups[enc_id].getPosition();
	var popup_overlay = new ol.Overlay({
		id: enc_id,
		element: document.getElementById("popup-"+enc_id),
		position: pos
	});
	

	//popups[enc_id] = popup_overlay;
	//map.addOverlay(popup_overlay);
	return popup_overlay;
}

function updatePopup(id, jUnit){
	
}

function updateMarkers(){
}

//Show street view
function openStreetView(lat, lon) {
	var dataUrl = 'http://cbk0.google.com/cbk?output=json&ll=' + lat + ',' + lon + '&';
	$.ajax({
		url: dataUrl,
		dataType: 'jsonp',
		data: {}
	})
	.done(function(data) {
		if (data && data.Location && data.Location.panoId) {
			var url = 'http://maps.google.com/maps?layer=c&cbp=0,,,,0&panoid=' + data.Location.panoId;
			window.open(url, "_self");
		} else {
			alert('Street view could not allocate position.');
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		alert('Street view - fail() \n textStatus: ' + textStatus + '\n errorThrown: ' + errorThrown);
	});
}

/****************************************************************************************
					Open layer map implementation
****************************************************************************************/
/*function putMarker(id, name, lat, lon, icon) {
	if (map != null) {
		var x = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([Number(lon), Number(lat)])));
		x.setId(id);
		x.setStyle(new ol.style.Style({
			image: new ol.style.Icon({
				src: icon,
				scale: 1.0
			})
		}));
		map.getLayers().item(1).getSource().addFeature(x);
	}	
}
*/

function putMarker(id, name, lat, lon, icon) {
	if(map!=null) {
		var x = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([Number(lon), Number(lat)])));
		x.setId(id);
		x.setStyle(new ol.style.Style({
			image: new ol.style.Icon({
				src: icon,
				scale: 1.0
			})
		}));
		var lf = map.getLayers();
		var f=null;
		if(lf!==null) f=lf.item(1).getSource().getFeatureById(id);
		if(f!==null) map.getLayers().item(1).getSource().removeFeature(f);
		map.getLayers().item(1).getSource().addFeature(x);
	}	
}

function resizeView(){
	var extent = map.getLayers().item(1).getSource().getExtent();
	map.getView().fit(extent, map.getSize());
}

function init_map() {
	var markersLocations = new ol.source.Vector();
	var markersLayer = new ol.layer.Vector({
		source: markersLocations
	});

	var streetmap = new ol.layer.Tile({
		source: new ol.source.OSM(),
		opacity: 0.75
	});

	var view = new ol.View({
		center: ol.proj.fromLonLat([-99.133204900, 19.432601800]),
		zoom: 16,
		minZoom: 4,
        maxZoom: 19
	});

	//var overlay = new ol.Overlay({
	//	element: document.getElementById('overlay')
	//});


	//var map = new ol.Map({
	map = new ol.Map({
		layers: [streetmap, markersLayer],
		target: 'map-container',
		view: view,
		loadTilesWhileInteracting: true
	});
	
	
	//popups[0] = overlay;
	//popups[1] = overlaye;
	
	//map.addOverlay(overlay);
	//map.addOverlay(overlaye);

	map.on('click', function(e) {
		//Busca features en el lugar seleccionado
		var features = map.getFeaturesAtPixel(e.pixel);
		if (features) {
			var id = features[0].getId();
			var coords = features[0].getGeometry().getCoordinates();
			//var degrees = ol.proj.transform(coords, 'EPSG:3857', 'EPSG:4326');
			//var hdms = ol.coordinate.toStringHDMS(degrees);
			popups[getEncodedId(id)].setPosition(coords);
		}
	});
	updateMarkers();
}

/**
* Add a click handler to hide the popup.
* @return {boolean} Don't follow the href.
*/
function closePopup(enc_id) {
	popups[enc_id].setPosition(undefined);
	return false;
};

/******************************************************************************
	GAUGES AND CONTROLS
******************************************************************************/
function createGauges()
{
	createGauge("sgn0", "Signal 0", 40);
	createGauge("sgn1", "Signal 1", 40);
	createGauge("sgn2", "Signal 2", 40);
	createGauge("sgn3", "Signal 3", 40);
}

function updateGauges()
{
	var i=0;
	for (var key in getGaugesCollection())
	{
		var value = getRandomValue(getGauge(key))
		getGauge(key).redraw(value);
		document.getElementsByName("lcdv")[i].innerHTML = " "+value.toFixed(3)+" ";
		i++;
	}
}

function getRandomValue(gauge)
{
	var overflow = 0; //10;
	return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
}

function init_gauges()
{
	//createGauges();
}