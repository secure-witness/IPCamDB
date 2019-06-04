function showHelp(item, headerid, bodyid){
	var hdre = document.getElementById(headerid);
	var bodye = document.getElementById(bodyid);
	var hdrt = "";
	var bodyt="";
	if(item==="menu"){
		hdrt = "Menú principal";
		bodyt = "Se muestran datos como el nombre del usuario y la fecha actual, además del enlace para acceder a la interfaz de Administración de unidades y operadores, así como el botón Salir, para cerrar la sesión";
	}
	else if(item==="mapa"){
		hdrt = "Mapa";
		bodyt = "Es la pantalla principal de la página web. En está sección se muestra la ubicación y estado de las unidades que se están rastreando. Las unidades son los diferentes objetivos de rastreo: vehicular, personal o para mercancías.";
	}
	else if(item==="botones"){
		hdrt = "Controles e Indicadores";
		bodyt = "En la parte izquierda se encuentran los botones principales para el control de las unidades y en el extremo derecho están los indicadores de eventos que están sucediendo con las unidades rastreadas.";
	}
	else if(item==="objetivos"){
		hdrt = "Información y Eventos";
		bodyt = "Se muestran los datos de cada una de las unidades que se están rastreando, así como los indicadores de los distintos eventos que están ocurriendo en dichas unidades.";
	}
	hdre.innerHTML = hdrt;
	bodye.innerHTML = bodyt;
}