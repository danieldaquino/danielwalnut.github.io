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
	that.Precision = 30;
	that.Period = 5;
	that.Guessed = 2;
	that.TracksLost = 0;
	that.TracksLostSinceLast = 0;
	that.TrackLostChecked = false;
	that.Busy = false;
	that.User = undefined;
	
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
		var now = new Date();
		var d = new Date(now - that.d0);
		var n = d.getMilliseconds();
		var s = d.getSeconds();
		var m = d.getMinutes();
		that.Time = n + s*1000 + (m%that.Period)*1000*60;
		
		//For debugging
		//that.Clear();
		//that.DrawRange(that.Time/(that.Period*1000*60), new Color(88,88,88,1), false);
		
		//Delay in milliseconds
		var TimeSinceLastCheck = d - that.LastCheck;
		//Number of checks will be at least number of laps ahead
		var NumOfChecks = parseInt(TimeSinceLastCheck/(that.Period*60*1000));
		//Delay within same period
		var PeriodDelaySinceLast = TimeSinceLastCheck%(that.Period*60*1000);
		//Position in the period of last time checked
		var RelativePositionLast = (that.LastCheck - new Date(0))%(that.Period*60*1000);
		var A = RelativePositionLast;
		//This time position inside the period of the last time we checked
		var RelativePositionSinceLast = RelativePositionLast + (PeriodDelaySinceLast);
		var B = RelativePositionSinceLast;
		if(B > that.Period*60*1000/2 && A < that.Period*60*1000/2) {
			//Means there is an extra half period check within last period
			NumOfChecks++;
		}
		for(var i=0;i < NumOfChecks;i++) {
			that.HalfPeriodCheck();
		}
		that.LastCheck = d;
	}
	
	that.HalfPeriodCheck = function() {
		if(that.Guessed != 2 && that.Guessed != 4) {
			//User lost track
			that.LostTrack();
			document.getElementById("TracksLostMessage").style.opacity = 1;
			that.TracksLost++;
			that.TracksLostSinceLast++;
			that.FlushData(1, "LOST_TRACK");
			if(that.TracksLostSinceLast == 1) {
				document.getElementById("TracksLostMessage").innerText = "You lost track of " + that.TracksLostSinceLast + " cycle";
			}
			else {
				document.getElementById("TracksLostMessage").innerText = "You lost track of " + that.TracksLostSinceLast + " cycles";						
			}
		}
		if(that.Guessed == 4) {
			//ALREADY GUESSED EARLY
			that.Guessed = 3;
		}
		else {
			that.Guessed = 0;
		}
	}
	
	that.Guess = function() {
		if(that.Busy) {
			return;
		}
		document.getElementById("TracksLostMessage").style.opacity = 0;
		that.TracksLostSinceLast = 0;
		var now = new Date();
		var d = new Date(now - that.d0);
		var n = d.getMilliseconds();
		var s = d.getSeconds();
		var m = d.getMinutes();
		var Time = n + s*1000 + (m%that.Period)*1000*60;
		var TimeSec = s + (m%that.Period)*60;
		var Range = TimeSec/(that.Period*60);
		if(TimeSec < that.Precision || TimeSec > that.Period*60 - that.Precision) {
			if(that.Guessed == 2 || that.Guessed == 4) {
				//Too early
				Range = 1 - Range;
				that.EarlyGuess(Range);
				if(that.Guessed == 2) {
					that.FlushData(that.Time, false);
				}
				else {
					that.FlushData(that.Time, true);					
				}
				that.Guessed = 4;
			}
			else {
				that.RightGuess();
				//RIGHT
				if(that.Guessed == 0) {
					//RIGHT ON THE MONEY
					if(that.Time < that.Period*60*1000/2) {
						that.FlushData(that.Time + that.Period*60*1000, false);
					}
					else {			
						that.FlushData(that.Time, false);
					}
				}
				else {
					//HAD HELP
					if(that.Time < that.Period*60*1000/2) {
						that.FlushData(that.Time + that.Period*60*1000, true);
					}
					else {					
						that.FlushData(that.Time, true);
					}
				}
				//NEXT!
				that.Guessed = 2;
			}
		}
		else {
			if(TimeSec > that.Period*60/2) {
				//EARLY
				Range = 1 - Range;
				that.EarlyGuess(Range);
				if(that.Guessed == 0) {
					//FIRST TRY
					that.Guessed = 1;
					that.FlushData(that.Time, false);
				}
				else if(that.Guessed == 3) {
					//NOT FIRST TRY
					that.FlushData(that.Time, true);
				}
			}
			else if(that.Guessed == 2 || that.Guessed == 4) {
				//TOO EARLY!!
				Range = 1 - Range;
				that.EarlyGuess(Range);
				if(that.Guessed == 2) {
					that.FlushData(that.Time, false);
				}
				else {
					that.FlushData(that.Time, true);					
				}
				that.Guessed = 4;
			}
			else {
				//TOO LATE
				that.LateGuess(Range);
				if(that.Guessed == 0 || that.Guessed == 3) {
					that.FlushData(that.Time + that.Period*60*1000, false);
				}
				else {
					that.FlushData(that.Time + that.Period*60*1000, true);					
				}
				that.Guessed = 2;
			}
		}
	}
	
	that.RightGuess = function(d0) {
		that.Clear();
		var now = new Date();
		if(!d0) {
			d0 = new Date();
		}
		var d = new Date(now - d0);
		var n = d.getMilliseconds();
		var s = d.getSeconds();
		var Time = n + s*1000;
		
		document.getElementById("Message").innerText = "Correct!";
		document.getElementById("Message").style.color = "#4CAF50";
		document.getElementById("Message").style.opacity = 1;
		
		if(Time > 3000) {
			document.getElementById("Message").style.opacity = 0;
		}
		
		that.Pulsate(new Color(76,175,80,1), 1000, Time);
		
		if(Time < 4000) {
			setTimeout(function() {
				that.RightGuess(d0);
			}, 1000/60);
			that.Busy = true;
		}
		that.Busy = false;
		return;
	}
	
	that.LateGuess = function(Range, d0) {
		that.Clear();
		var now = new Date();
		var d;
		var n;
		var s;
		var Time;
		if(!d0) {
			d0 = new Date();
			Time = 0;
		}
		else {
			d = new Date(now - d0);
			n = d.getMilliseconds();
			s = d.getSeconds();
			Time = n + s*1000;
		}
		
		document.getElementById("Message").innerText = "You're late!";
		document.getElementById("Message").style.color = "#F44336";
		document.getElementById("Message").style.opacity = 1;
		
		if(Time > 3000) {
			document.getElementById("Message").style.opacity = 0;
		}
		
		var A = 1;
		if(Time > 3000) {
			A = 1 - (Time - 3000)/1000;
		}
		that.AnimateRange(Range, new Color(244, 67, 54,A), false, 2000, Time);
		
		if(Time < 4000) {
			setTimeout(function() {
				that.LateGuess(Range, d0);
			}, 1000/60);
			that.Busy = true;
			return;
		}
		that.Busy = false;
		return;
	}
	
	that.LostTrack = function(d0) {
		that.Clear();
		var now = new Date();
		if(!d0) {
			d0 = new Date();
		}
		var d = new Date(now - d0);
		var n = d.getMilliseconds();
		var s = d.getSeconds();
		var Time = n + s*1000;
		
		that.Pulsate(new Color(244, 67, 54, 1), 1000, Time, 0.5);
		
		document.getElementById("Message").innerText = "You lost track";
		document.getElementById("Message").style.color = "#F44336";
		document.getElementById("Message").style.opacity = 1;
		
		if(Time > 3000) {
			document.getElementById("Message").style.opacity = 0;
		}
		
		if(Time < 4000) {
				setTimeout(function() {
				that.LostTrack(d0);
			}, 1000/60);
				that.Busy = true;
				return;
		}
		that.Busy = false;
		return;
	}
	
	that.EarlyGuess = function(Range, d0) {
		that.Clear();
		var now = new Date();
		var d;
		var n;
		var s;
		var Time;
		if(!d0) {
			d0 = new Date();
			Time = 0;
		}
		else {
			d = new Date(now - d0);
			n = d.getMilliseconds();
			s = d.getSeconds();
			Time = n + s*1000;
		}
		
		document.getElementById("Message").innerText = "You're early";
		document.getElementById("Message").style.color = "2962FF";
		document.getElementById("Message").style.opacity = 1;
		
		var A = 1;
		if(Time > 3000) {
			A = 1 - (Time - 3000)/1000;
			document.getElementById("Message").style.opacity = 0;
		}
		that.AnimateRange(Range, new Color(41,98,255,A), true, 2000, Time);		
		
		if(Time < 4000) {
			setTimeout(function() {
				that.EarlyGuess(Range, d0);
			}, 1000/60);
			that.Busy = true;
			return;
		}
		that.Busy = false;
		return;
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
		that.LastGuess = that.d0;
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
	path = path || "https://maker.ifttt.com/trigger/aion_data/with/key/bBTgZ_uh4v_eh76VIq8MpsTIij3L67rf8ofI8kyaHtv"
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