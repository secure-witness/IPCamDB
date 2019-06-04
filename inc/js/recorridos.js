
$(document).ready(function(){
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

function getHistorialPage(from, to, name, idx){
	var datarequest = createAjaxRequest();
	datarequest.onreadystatechange = function(){
		if(datarequest.readyState==4 && datarequest.status==200){
			document.getElementById("dataPage").innerHTML = datarequest.responseText;
		}
	};
	
	datarequest.open("GET","historialdataindex.php?f="+from+"&t="+to+"&n="+name+"&i="+idx,true);
	datarequest.send(); 
}

function getRecorridos(idx){
	var f = document.getElementById("dateFrom").value;
	var t = document.getElementById("dateTo").value;
	var n = document.getElementById("objName").value;
	var datarequest;
	
	if(f==="" || t===""){
		alert("Debe seleccionar una fecha inicial y una final");
		return;
	}
	
	if(compararFechas(f, t)===1){ //Invertir fechas
		document.getElementById("dateFrom").value = t;
		document.getElementById("dateTo").value = f;
		f = document.getElementById("dateFrom").value;
		t = document.getElementById("dateTo").value;
	}

	datarequest = createAjaxRequest();
	datarequest.onreadystatechange = function(){
		if(datarequest.readyState==4 && datarequest.status==200){
			document.getElementById("recorridoData").innerHTML = datarequest.responseText;
			getHistorialPage(f,t,n,idx);
		}
	};
	
	datarequest.open("GET","historialdata.php?f="+f+"&t="+t+"&n="+n,true);
	datarequest.send(); 
}