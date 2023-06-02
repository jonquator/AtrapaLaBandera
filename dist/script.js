$(document).ready(function () {
	let rondaMostrar = 1;
	let ronda = 0;
	let turno = 0;
	let turnos = ["azul", "rojo", "rojo", "azul", "finRondas"]; //orden de turnos; finRonda(s) indica el momento reiniciar el contador turno

	let downloadTimer;
	let activeNextTimer;

	$("#lightDarkTheme").on("click", function () {
		if (getCookie("cookieconsent_status") == "dismiss") {
			if (getCookie("lightDarkTheme") == "light") {
				$("#iconoLightDarkTheme").removeClass("fa-moon").addClass("fa-sun");
				$(
					"body, nav, .card, #accion1, #accion2, #accion3, #accion4, #accion5, .modal-header, .modal-body, .modal-footer, .close, table, tr"
				).attr("data-theme", "dark");
				setCookie("lightDarkTheme", "", 365);
				setCookie("lightDarkTheme", "dark", 365);
			} else {
				$("#iconoLightDarkTheme").removeClass("fa-sun").addClass("fa-moon");
				$(
					"body, nav, .card, #accion1, #accion2, #accion3, #accion4, #accion5, .modal-header, .modal-body, .modal-footer, .close, table, tr"
				).attr("data-theme", "light");
				setCookie("lightDarkTheme", "", 365);
				setCookie("lightDarkTheme", "light", 365);
			}
		} else {
			if ($("body").attr("data-theme") == "light") {
				$("#iconoLightDarkTheme").removeClass("fa-moon").addClass("fa-sun");
				$(
					"body, nav, .card, #accion1, #accion2, #accion3, #accion4, #accion5, .modal-header, .modal-body, .modal-footer, .close, table, tr"
				).attr("data-theme", "dark");
			} else if ($("body").attr("data-theme") == "dark") {
				$("#iconoLightDarkTheme").removeClass("fa-sun").addClass("fa-moon");
				$(
					"body, nav, .card, #accion1, #accion2, #accion3, #accion4, #accion5, .modal-header, .modal-body, .modal-footer, .close, table, tr"
				).attr("data-theme", "light");
			}
		}
	});

	$("#accionTiempo").on("click", function () { //botón de play pausa para el cronometro de tiempo de partida
		$("#iconAccionTiempo").toggleClass("fa-play fa-pause");
		$("#demo1").stopwatch("toggle");

		if ($("#iconAccionTiempo").hasClass("fa-pause")) { //si está el simbolo de pause significa que está activo
			$("#siguienteTurno").removeClass("disabled").addClass("avtive").attr("aria-disabled", "false");
			$("li[id*=accion]").each(function (index, element) {
				var indice = index + 1;
				if ($("#" + element.id).attr("aria-disabled") == "false") {
					$("#" + element.id).removeClass("disabled").addClass("active");
					$("#botonAccion" + indice).removeClass("active").addClass("disabled");
				}
			});
		} else if ($("#iconAccionTiempo").hasClass("fa-play")) {//si está el simbolo de play significa que está puasado
			$("#siguienteTurno").removeClass("avtive").addClass("disabled").attr("aria-disabled", "true");
			$("li[id*=accion]").each(function (index, element) {
				var indice = index + 1;
				if ($("#" + element.id).attr("aria-disabled") == "false") {
					$("#" + element.id).removeClass("active").addClass("disabled");
					$("#botonAccion" + indice).removeClass("active").addClass("disabled");
				}
			});
		}
	});

	//evento al pulsar el botón de inicio de partida
	$("#pressStart").on("click", function () {
		//oculta el botón inicio partida y muestra el de finalizar partida y el contenedor
		$("#pressStart").hide("slow");
		$("#endGame, #ocultoTurnos").show("slow");

		//inicia el cronometro de tiempo de partida
		$("#demo1").stopwatch().stopwatch("start");

		//muestra un modal con el nombre del equipo que juega el primer turno, inicia la cuenta de ronda y la escribe y llena las barras de progreso de las acciones de turno
		$("#modalTurno").modal("show");
		$("#insertTurnoModal, #cardHeaderTurno").text(turnos[turno]);
		$("#numRonda").text(rondaMostrar);
		$("#countDown").text("--");
		$("#accion1").addClass("active");
		$("#progressbar1, #progressbar2, #progressbar3, #progressbar4, #progressbar5, #progressbar6").css("width", "100%");
		$("#accion1").removeClass("disabled").attr("aria-disabled", "false");
	});

	//finaliza el juego, muestra el tiempo de partida en un modal y al cerrar el modal actualiza la página
	$("#endGame").on("click", function () {
		$("#demo1").stopwatch().stopwatch("stop");
		$("#modalTerminarJuego").modal("show");
		var tiempoTotalPartida = "";
		$.each($("#demo1").text().split(":"), function (index, value) {
			var letras = ["h ", "m ", "s "];
			tiempoTotalPartida += value + letras[index];
		});

		$("#tiempoTotalPartida").text(tiempoTotalPartida);
		$("#modalTerminarJuego").on("hidden.bs.modal", function () {
			history.go(0);
		});
	});

	$("#siguienteTurno").on("click", function () {
		/*$("#siguienteTurno").addClass("disabled").attr("aria-disabled", "true");*/
		clearInterval(downloadTimer);

		turno++;
		rondaMostrar++;
		if (turnos[turno] === "finRondas") {
			turno = 0;
		}
		$("#numRonda").text(rondaMostrar);
		$("#modalTurno").modal("show");
		$("#insertTurnoModal, cardHeaderTurno").text(turnos[turno]);

		$("#botonAccion1, #botonAccion2, #botonAccion3, #botonAccion4, #botonAccion5, #botonAccion6").show("slow");
		$("#botonAccion1_2, #botonAccion2_2, #botonAccion3_2, #botonAccion4_2, #botonAccion5_2, #botonAccion6_2").hide("slow");

		$("#accion1, #botonAccion1").removeClass("disabled").attr("aria-disabled", "false");
		$("#accion1").addClass("active");
		$("#accion2, #accion3, #accion4, #accion5, #accion6").addClass("disabled").removeClass("active").attr("aria-disabled", "true");

		$("div[id*=progressbar]").css("width", "100%");

		/*$("#progressbar1, #progressbar2, #progressbar3, #progressbar4, #progressbar5").css("width", "100%");*/
	});

	$("#botonAccion1").on("click", function () {
		$("#botonAccion1").hide("slow");
		$("#botonAccion1_2").show("slow");
		var timeleft = 5;
		$("#countDown").text(timeleft);
		$("#progressbar1").css("width", (timeleft * 100) / 5 + "%");
		downloadTimer = setInterval(function () {
			timeleft--;
			$("#countDown").text(timeleft);
			$("#progressbar1").css("width", (timeleft * 100) / 5 + "%");
			if (timeleft <= 0) {
				clearInterval(downloadTimer);
				$("#countDown").text(timeleft);
				$("#progressbar1").css("width", (timeleft * 100) / 5 + "%");
				activeNextTimer = setInterval(function () {
					$("#countDown").text("--");
					$("#accion1").removeClass("active").addClass("disabled").attr("aria-disabled", "true");
					$("#accion2").removeClass("disabled").attr("aria-disabled", "false");
					$("#accion2").addClass("active");
					clearInterval(activeNextTimer);
				}, 1000);
			}
		}, 1000);
	});

	$("#botonAccion1_2").on("click", function () {
		clearInterval(downloadTimer);
		clearInterval(activeNextTimer);
		$("#progressbar1").css("width", "0%");
		$("#countDown").text("--");
		$("#accion1").removeClass("active");
		$("#accion1").addClass("disabled").attr("aria-disabled", "true");
		$("#accion2").removeClass("disabled").attr("aria-disabled", "false");
		$("#accion2").addClass("active");
	});

	$("#botonAccion2").on("click", function () {
		$("#botonAccion2").hide("slow");
		$("#botonAccion2_2").show("slow");
		var timeleft = 15;
		$("#countDown").text(timeleft);
		$("#progressbar2").css("width", (timeleft * 100) / 15 + "%");
		downloadTimer = setInterval(function () {
			timeleft--;
			$("#countDown").text(timeleft);
			$("#progressbar2").css("width", (timeleft * 100) / 15 + "%");
			if (timeleft <= 0) {
				clearInterval(downloadTimer);
				$("#countDown").text(timeleft);
				$("#progressbar2").css("width", (timeleft * 100) / 15 + "%");
				activeNextTimer = setInterval(function () {
					$("#countDown").text("--");
					$("#accion2").removeClass("active");
					$("#accion2").addClass("disabled").attr("aria-disabled", "true");
					$("#accion3").removeClass("disabled").attr("aria-disabled", "false");
					$("#accion3").addClass("active");
					clearInterval(activeNextTimer);
				}, 1000);
			}
		}, 1000);
	});

	$("#botonAccion2_2").on("click", function () {
		clearInterval(downloadTimer);
		clearInterval(activeNextTimer);
		$("#progressbar2").css("width", "0%");
		$("#countDown").text("--");
		$("#accion2").removeClass("active");
		$("#accion2").addClass("disabled").attr("aria-disabled", "true");
		$("#accion3").removeClass("disabled").attr("aria-disabled", "false");
		$("#accion3").addClass("active");
	});

	$("#botonAccion3").on("click", function () {
		$("#botonAccion3").hide("slow");
		$("#botonAccion3_2").show("slow");
		var timeleft = 7;
		$("#countDown").text(timeleft);
		$("#progressbar3").css("width", (timeleft * 100) / 7 + "%");
		downloadTimer = setInterval(function () {
			timeleft--;
			$("#countDown").text(timeleft);
			$("#progressbar3").css("width", (timeleft * 100) / 7 + "%");
			if (timeleft <= 0) {
				clearInterval(downloadTimer);
				$("#countDown").text(timeleft);
				$("#progressbar3").css("width", (timeleft * 100) / 7 + "%");
				activeNextTimer = setInterval(function () {
					$("#countDown").text("--");
					$("#accion3").removeClass("active");
					$("#accion3").addClass("disabled").attr("aria-disabled", "true");
					$("#accion4").removeClass("disabled").attr("aria-disabled", "false");
					$("#accion4").addClass("active");
					clearInterval(activeNextTimer);
				}, 1000);
			}
		}, 1000);
	});

	$("#botonAccion3_2").on("click", function () {
		clearInterval(downloadTimer);
		clearInterval(activeNextTimer);
		$("#progressbar3").css("width", "0%");
		$("#countDown").text("--");
		$("#accion3").removeClass("active");
		$("#accion3").addClass("disabled").attr("aria-disabled", "true");
		$("#accion4").removeClass("disabled").attr("aria-disabled", "false");
		$("#accion4").addClass("active");
	});

	$("#botonAccion4").on("click", function () {
		$("#botonAccion4").hide("slow");
		$("#botonAccion4_2").show("slow");
		var timeleft = 7;
		$("#countDown").text(timeleft);
		$("#progressbar4").css("width", (timeleft * 100) / 7 + "%");
		downloadTimer = setInterval(function () {
			timeleft--;
			$("#countDown").text(timeleft);
			$("#progressbar4").css("width", (timeleft * 100) / 7 + "%");
			if (timeleft <= 0) {
				clearInterval(downloadTimer);
				$("#countDown").text(timeleft);
				$("#progressbar4").css("width", (timeleft * 100) / 7 + "%");
				activeNextTimer = setInterval(function () {
					$("#countDown").text("--");
					$("#accion4").removeClass("active");
					$("#accion4").addClass("disabled").attr("aria-disabled", "true");
					$("#accion5").removeClass("disabled").attr("aria-disabled", "false");
					$("#accion5").addClass("active");
					clearInterval(activeNextTimer);
				}, 1000);
			}
		}, 1000);
	});

	$("#botonAccion4_2").on("click", function () {
		clearInterval(downloadTimer);
		clearInterval(activeNextTimer);
		$("#progressbar4").css("width", "0%");
		$("#countDown").text("--");
		$("#accion4").removeClass("active");
		$("#accion4").addClass("disabled").attr("aria-disabled", "true");
		$("#accion5").removeClass("disabled").attr("aria-disabled", "false");
		$("#accion5").addClass("active");
	});

	$("#botonAccion5").on("click", function () {
		$("#botonAccion5").hide("slow");
		$("#botonAccion5_2").show("slow");
		var timeleft = 10;
		$("#countDown").text(timeleft);
		$("#progressbar5").css("width", (timeleft * 100) / 10 + "%");
		downloadTimer = setInterval(function () {
			timeleft--;
			$("#countDown").text(timeleft);
			$("#progressbar5").css("width", (timeleft * 100) / 10 + "%");
			if (timeleft <= 0) {
				clearInterval(downloadTimer);
				$("#countDown").text(timeleft);
				$("#progressbar5").css("width", (timeleft * 100) / 10 + "%");
				activeNextTimer = setInterval(function () {
					$("#countDown").text("--");
					$("#accion5").removeClass("active");
					$("#accion5").addClass("disabled").attr("aria-disabled", "true");
					/*$("#siguienteTurno").removeClass("disabled").attr("aria-disabled", "false");*/
					clearInterval(activeNextTimer);
				}, 1000);
			}
		}, 1000);
	});

	$("#botonAccion5_2").on("click", function () {
		clearInterval(downloadTimer);
		clearInterval(activeNextTimer);
		$("#progressbar5").css("width", "0%");
		$("#countDown").text("--");
		$("#accion5").removeClass("active");
		$("#accion5").addClass("disabled").attr("aria-disabled", "true");
		$("#accion6").removeClass("disabled").attr("aria-disabled", "false");
		$("#accion6").addClass("active");
	});

	$("#botonAccion6").on("click", function () {
		$("#botonAccion6").hide("slow");
		$("#botonAccion6_2").show("slow");
		var timeleft = 5;
		$("#countDown").text(timeleft);
		$("#progressbar6").css("width", (timeleft * 100) / 5 + "%");
		downloadTimer = setInterval(function () {
			timeleft--;
			$("#countDown").text(timeleft);
			$("#progressbar6").css("width", (timeleft * 100) / 5 + "%");
			if (timeleft <= 0) {
				clearInterval(downloadTimer);
				$("#countDown").text(timeleft);
				$("#progressbar6").css("width", (timeleft * 100) / 5 + "%");
				activeNextTimer = setInterval(function () {
					$("#countDown").text("--");
					$("#accion6").removeClass("active");
					$("#accion6").addClass("disabled").attr("aria-disabled", "true");
					/*$("#siguienteTurno").removeClass("disabled").attr("aria-disabled", "false");*/
					clearInterval(activeNextTimer);
				}, 1000);
			}
		}, 1000);
	});

	$("#botonAccion6_2").on("click", function () {
		clearInterval(downloadTimer);
		clearInterval(activeNextTimer);
		$("#progressbar6").css("width", "0%");
		$("#countDown").text("--");
		$("#accion6").removeClass("active");
		$("#accion6").addClass("disabled").attr("aria-disabled", "true");
		/*$("#siguienteTurno").removeClass("disabled").attr("aria-disabled", "false");*/
	});
});

function addGlow() {
	$("#modalGuiaJuego").modal("hide");
	$("#downloadsBtn1").addClass("glow");
	$("#downloadsBtn2").addClass("glow");
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function checkCookie() {
	if (getCookie("cookieconsent_status") == "dismiss") {
		if (getCookie("lightDarkTheme") != "") {
			if (getCookie("lightDarkTheme") == "light") {
				$("#iconoLightDarkTheme").removeClass("fa-sun").addClass("fa-moon");
			} else {
				$("#iconoLightDarkTheme").removeClass("fa-moon").addClass("fa-sun");
			}
			$("body, nav, .card, #accion1, #accion2, #accion3, #accion4, #accion5, #accion6, .modal-header, .modal-body, .modal-footer, .close, table, tr").attr("data-theme", getCookie("lightDarkTheme"));
		} else {
			setCookie("lightDarkTheme", "light", 365);
			$("body, nav, .card, #accion1, #accion2, #accion3, #accion4, #accion5, #accion6, .modal-header, .modal-body, .modal-footer, .close, table, tr").attr("data-theme", "light");
		}
	} else {
		$("body, nav, .card, #accion1, #accion2, #accion3, #accion4, #accion5, #accion6, .modal-header, .modal-body, .modal-footer, .close, table, tr").attr("data-theme", "light");
	}
}
