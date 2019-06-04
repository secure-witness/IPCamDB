$(document).ready(updateClock);

function updateOperators(){
	var datarequest = createAjaxRequest();
	datarequest.onreadystatechange = function(){
		if(datarequest.readyState==4 && datarequest.status==200){
			document.getElementById("operTable").innerHTML=datarequest.responseText;
		}
	};
	datarequest.open("GET","operadores.php",true);
	datarequest.send();
}

function updateUnits(){
	var datarequest = createAjaxRequest();
	datarequest.onreadystatechange = function(){
		if(datarequest.readyState==4 && datarequest.status==200){
			document.getElementById("asignTable").innerHTML=datarequest.responseText;
		}
	};
	datarequest.open("GET","assign.php",true);
	datarequest.send();
}

function assignModal(){
	var datarequest = createAjaxRequest();
	datarequest.onreadystatechange = function(){
		if(datarequest.readyState==4 && datarequest.status==200){
			document.getElementById("adminModal").innerHTML=datarequest.responseText;
			$(adminModal).modal();
		}
	};
	datarequest.open("GET","assignmodal.php",true);
	datarequest.send();
}

function addOper(){
	var datarequest = createAjaxRequest();
	var usuario = document.getElementById("user").value;
	var pass = document.getElementById("pass").value;
	var nombre = document.getElementById("nombre").value;
	var tel = document.getElementById("tel").value;

	if((usuario===null || usuario==="") || (pass===null || pass==="") || (nombre===null || nombre==="")){
		alert("Debe llenar todos los campos para poder continuar.");
		return;
	}

	datarequest.onreadystatechange = function(){
		if(datarequest.readyState==4 && datarequest.status==200){
			updateOperators();
			document.getElementById("adminModal").innerHTML=datarequest.responseText;
			$(adminModal).modal();
		}
	};
	datarequest.open("GET","addoper.php?usuario="+usuario+"&pass="+pass+"&nombre="+nombre+"&tel="+tel, true);
	datarequest.send();
}

function remOper(){
	var datarequest = createAjaxRequest();
	var oper = document.getElementById("operador").value;
	if (confirm("¿Está seguro de que desea eliminar al operador "+ oper +"?\nEsta acción eliminará la cuenta del usuario del sistema.")) {
		datarequest.onreadystatechange = function(){
			if(datarequest.readyState==4 && datarequest.status==200){
				updateOperators();
				document.getElementById("notifModal").innerHTML=datarequest.responseText;
				$(notifModal).modal();
			}
		};
		$(adminModal).modal("hide");
		datarequest.open("GET","remoper.php?operador="+oper,true);
		datarequest.send();
	} else {
		$(adminModal).modal("hide");
	}
}

function remOperModal(){
	var datarequest = createAjaxRequest();
	datarequest.onreadystatechange = function(){
		if(datarequest.readyState==4 && datarequest.status==200){
			document.getElementById("adminModal").innerHTML=datarequest.responseText;
			$(adminModal).modal();
		}
	};
	datarequest.open("GET","remopermodal.php",true);
	datarequest.send();
}

function addOperModal(){
	var datarequest = createAjaxRequest();
	datarequest.onreadystatechange = function(){
		if(datarequest.readyState==4 && datarequest.status==200){
			document.getElementById("adminModal").innerHTML=datarequest.responseText;
			$(adminModal).modal();
		}
	};
	datarequest.open("GET","addopermodal.php",true);
	datarequest.send();
}