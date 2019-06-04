/******************************************************************************
*
*	scripts.js
*	Descripción: Biblioteca de scripts auxiliares
*	Elaborado por: Ing. Francisco David Meneses Bautista
*	Proyecto: Sistema web de monitoreo para adquisidores de señales
*	Creado: 05/Ene/2018
*	Modificado: 05/Ene/2018
*	Ballhausen Ingeniería.
*
*****************************************************************************/

//Para fechas en español
var meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL",
             "MAYO", "JUNIO", "JULIO", "AGOSTO",
             "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
var dias = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

/*	Función createAjaxRequest()
*	Descripción: Crea un objeto XMLHTTP para solicitudes AJAX
*	Modificada: 05/Ene/2018
*	Entradas: ninguna
*	Salidas: objeto XMLHTTP listo, o null en caso de error
*/
function createAjaxRequest(){
	var req=null;
	if (window.XMLHttpRequest){ // code for IE7+, Firefox, Chrome, Opera, Safari
		req = new XMLHttpRequest();
	}
	else{ // code for IE6, IE5
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return req;
}

function updateClock(){
	var dateAct = new Date(); //Obtiene la hora y fecha actual del sistema
	var fechal = dias[dateAct.getDay()] + " " + dateAct.getDate() + " DE " + meses[dateAct.getMonth()] + " DE " + dateAct.getFullYear();
	var fechac = "";
	if(dateAct.getDate()<10) fechac = "0";
	fechac = fechac + dateAct.getDate() + "/";
	if(dateAct.getMonth()<9)fechac = fechac + "0"; 
	fechac = fechac + (dateAct.getMonth()+1) + "/" + dateAct.getFullYear();
	var hora = "";
	if(dateAct.getHours()<10) hora = "0";
	hora = hora + dateAct.getHours()+":";
	if(dateAct.getMinutes()<10) hora = hora + "0";
	hora = hora + dateAct.getMinutes()+":";
	if(dateAct.getSeconds()<10) hora = hora + "0";
	hora = hora + dateAct.getSeconds();

	document.getElementById("reloj").innerHTML = hora; //Actualiza hora
	document.getElementById("fecha-corta").innerHTML = fechac; //Actualiza fecha corta
	document.getElementById("fecha-larga").innerHTML = fechal; //Actualiza fecha larga

}

function checarFecha(fecha) {
    var tokens = fecha.split("/");
    var d = tokens[0];
    var m = tokens[1];
    var y = tokens[2];
    return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
}

function compararFechas(fecha1, fecha2) {
    var tokens = fecha1.split("/");
    var d1 = parseInt(tokens[0]);
    var m1 = parseInt(tokens[1])-1;
    var y1 = parseInt(tokens[2]);
    tokens = fecha2.split("/");
    var d2 = parseInt(tokens[0]);
    var m2 = parseInt(tokens[1])-1;
    var y2 = parseInt(tokens[2]);
    
    var dt1 = new Date(y1, m1, d1);
    var dt2 = new Date(y2, m2, d2);
    
    if(dt1.valueOf()===dt2.valueOf()) return 0;
    if(dt1.valueOf()>dt2.valueOf()) return 1;
    if(dt1.valueOf()<dt2.valueOf()) return -1;
    return false;
}

function formatDate(d){
	var tokens = d.split("/");
    var d = parseInt(tokens[0]);
    var m = parseInt(tokens[1]);
    var y = parseInt(tokens[2]);
    return y+"-"+m+"-"+d;
}

function closeWin(){
	window.close();
}

// Shows Configuración modal 
function configModal(modalType) {
	var datarequest = createAjaxRequest();
	datarequest.onreadystatechange = function() {
		if (datarequest.readyState == 4 && datarequest.status == 200) {
			var cmodal = document.getElementById("confModal");
			cmodal.innerHTML = datarequest.responseText;
			$("#confModal").modal();
		}
	};

	datarequest.open("GET", "cmodal.php", true);
	datarequest.send();
}

//Verifica restricciones antes de enviar
function verifyConfig(modal_id, form_id){
	var passed = true;
	passed = passed && (Number(document.getElementById("srate_value").value) >= 5.0);
	if(passed)
		submitFormAJAX(modal_id, form_id)
	else
		alert("Tasa de muestreo mínima de 5 s. Corrija el valor e inténtelo nuevamente.");
}

//Enviar modal POST
function submitFormAJAX(modal_id, form_id){
	var xhr = new XMLHttpRequest();
	var form = document.getElementById(form_id);
	var modal = document.getElementById(modal_id);
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4 && xhr.status == 200) {
			alert(xhr.responseText);
		}
	};

	xhr.open(form.method, form.action, true);
	xhr.send(new FormData(form));
	$('#'+modal_id).modal('hide');
}