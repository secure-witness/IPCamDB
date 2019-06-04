
$(document).ready(function(){
	/*Inicialización de calendarios*/
        $("#dateFrom").datepicker({
        	changeMonth: true,
        	changeYear: true,
        	dateFormat: "dd/mm/yy",
            constrainInput: true,
            showOn: 'button',
            buttonText: "<span class='glyphicon glyphicon-calendar'></span>"
        });
        $("#dateTo").datepicker({
        	changeMonth: true,
        	changeYear: true,
        	dateFormat: "dd/mm/yy",
            constrainInput: true,
            showOn: 'button',
            buttonText: "<span class='glyphicon glyphicon-calendar'></span>"
        });
    });

function getHistorial(idx){
	var f = document.getElementById("dateFrom").value;
	var t = document.getElementById("dateTo").value;
	var n = document.getElementById("objName").value;
	
	if(f==="" || t===""){
		alert("Debe seleccionar una fecha inicial y una final");
		return;
	}
	
	if(compararFechas(f, t)===1){ //Invertir fechas
		document.getElementById("dateFrom").value=t;
		document.getElementById("dateTo").value=f;
		f = document.getElementById("dateFrom").value;
		t = document.getElementById("dateTo").value;
	}
	var datarequest = createAjaxRequest();
	datarequest.onreadystatechange = function(){
		if(datarequest.readyState==4 && datarequest.status==200){
			document.getElementById("historialData").innerHTML = datarequest.responseText;
		}
	};

	datarequest.open("GET","historialdata.php?f="+f+"&t="+t+"&n="+n+"&i="+idx,true);
	datarequest.send(); 
}
