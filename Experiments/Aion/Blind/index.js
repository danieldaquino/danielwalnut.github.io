function DoKey(event) {
	event.preventDefault();
	var code = event.keyCode || event.which;
	switch (code) {
		case 32:
			Watch.Guess();
			break;
	}
}

/*Aion Things*/

function Load() {
	Watch = new Aion(document.getElementById("can"));
	document.getElementById("Current").addEventListener("click", Watch.Guess, false);
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	    document.getElementById("Instruction").style.display = "none";
	}
	Watch.Init();
}

function Aion(canvas) {
	var that = this;
	that.canvas = document.getElementById("can");
	that.ctx = canvas.getContext("2d");
	that.User = undefined;
	that.LastTap = undefined;
	that.Busy = false;
	that.Guesses = new Array();	

	that.DrawRange = function(Range, TheColor, CounterClockwise) {
		that.ctx.strokeStyle = FormatColor(TheColor);
		that.ctx.lineWidth = 7;
		that.ctx.beginPath();
		var FinishAngle = Range * 2 * Math.PI -Math.PI/2;
		if(CounterClockwise) {
			FinishAngle = 3*Math.PI/2 - Range * 2 * Math.PI;
			if(Range == 0) {
				FinishAngle = -Math.PI/2;
			}
		}
		that.ctx.arc(canvas.width/2,canvas.height/2,canvas.height/2-8, -Math.PI/2, FinishAngle, CounterClockwise);
		that.ctx.stroke();
	}
	
	that.AnimateRange = function(Range, TheColor, CounterClockwise, Duration, Time) {
		var RelTime = Math.min(Time/Duration, 1);
		var AnimTime = Interpolation(RelTime, 1);
		var AnimRange = Range*Math.min(AnimTime, 1);
		that.DrawRange(AnimRange, TheColor, CounterClockwise);
	}
	
	that.Pulsate = function(TheColor, Period, Time, Range) {
		if(Range == undefined) {
			Range = 1;
		}
		TheColor.A = 0.5*Math.sin(Math.PI*2*(1/Period)*Time - Math.PI/2) + 0.5;
		that.DrawRange(Range, TheColor, false);
	}
	
	that.Play = function() {
	}
	
	that.Guess = function() {
		if(that.Busy) {
			return;
		}
		//new
		var now = new Date();
		var d = new Date(now - that.LastTap);
		var n = d.getMilliseconds();
		var s = d.getSeconds();
		var m = d.getMinutes();
		var Time = n + s*1000 + m*1000*60;
		that.FlushData(Time, false);
		that.LastTap = now;
		document.getElementById("Message").innerText = "Registered time.";
		document.getElementById("Message").style.color = "#4CAF50";
		document.getElementById("Message").style.opacity = 1;
		document.getElementById("TracksLostMessage").innerText = "Please tap again in five minutes.";
		document.getElementById("TracksLostMessage").style.color = "#4CAF50";
		document.getElementById("TracksLostMessage").style.opacity = 1;
		that.Busy = true;
		setTimeout(function() {			
			document.getElementById("Message").style.opacity = 0;
			document.getElementById("TracksLostMessage").style.opacity = 0;
			that.Busy = false;
		}, 4000);
		//new end
	}

	that.FlushData = function(time, secondary) {
		Post(undefined, "value1=" + time + "&value2=" + secondary + "&value3=" + that.User);
	}

	that.Clear = function() {
		that.ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	that.Init = function() {
		if(localStorage.getItem("User") == undefined || localStorage.getItem("UserName") == undefined) {
			localStorage.setItem("User", Math.random());
			localStorage.setItem("UserName", prompt("Welcome to the experiment! What is your name?"));
		}
		that.User = localStorage.getItem("User");
		PostName(undefined, "value1=" + localStorage.getItem("UserName") + "&value2=&value3=" + that.User);
		that.d0 = new Date();
		that.LastTap = that.d0;
		that.Clock = setInterval(that.Play, 1000/60);
	}
}

Interpolation = function(Num, Type) {
		switch(Type) {
		case 0:
			//Ease in ease out
			return 0.5*Math.tanh(6*Num - 3) + 0.5;
			break;
		case 1:
			//Ease out
			return Math.tanh(4*Num);
			break;
	}
}

function Color(R, G, B, A) {
	this.R = R;
	this.G = G;
	this.B = B;
	this.A = A;
}

function FormatColor(TheColor) {
	return "rgba(" + TheColor.R + ", " + TheColor.G + ", " + TheColor.B + ", " + TheColor.A + ")";
}

function Post(path, params) {
	var xhttp = new XMLHttpRequest();
	path = path || "https://maker.ifttt.com/trigger/aion_blind_data/with/key/bBTgZ_uh4v_eh76VIq8MpsTIij3L67rf8ofI8kyaHtv"
	xhttp.open("POST", path, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(params);
}

function PostName(path, params) {
	var xhttp = new XMLHttpRequest();
	path = path || "https://maker.ifttt.com/trigger/aion_name/with/key/bBTgZ_uh4v_eh76VIq8MpsTIij3L67rf8ofI8kyaHtv"
	xhttp.open("POST", path, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(params);
}