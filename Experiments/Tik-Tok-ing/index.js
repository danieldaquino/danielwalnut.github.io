function Task(Name, pos) {
	var that = this;
	that.Done = false;
	that.Name = Name;
	that.Time = 0;
	that.pos = pos;
	that.Obj = document.createElement("div");
	that.Obj.classList.add("QueueObject");
	that.Obj.innerText = that.Name;
	that.Obj.style.order = that.pos;
	document.getElementById("LeftQueue").appendChild(that.Obj);
	that.Do = function() {
		if (!that.Done) {
			document.getElementById("LeftQueue").removeChild(that.Obj);
			document.getElementById("RightQueue").appendChild(that.Obj);
			that.Obj.style.order = - that.pos;
			that.Done = true;
		}
	}
	that.Undo = function() {
		if (that.Done) {
			document.getElementById("RightQueue").removeChild(that.Obj);
			document.getElementById("LeftQueue").appendChild(that.Obj);
			that.Obj.style.order = that.pos;
			that.Done = false;
		}
	}
}

function Next() {
	if (TaskCursor != Tasks.length) {
		if (TaskCursor != -1) {
			Tasks[TaskCursor].Do();
		}
		TaskCursor++;
		DrawMainTask();
	}
}

function Previous() {
	if (TaskCursor != -1) {
		if (TaskCursor != Tasks.length) {
			Tasks[TaskCursor].Undo();
		}
		TaskCursor--;
		DrawMainTask();
	}
}

function DrawClock() {
	if (TaskCursor != -1 && TaskCursor < Tasks.length) {
		document.getElementById("TimerObj").innerText = FormatTime(Tasks[TaskCursor].Time);
	} else if (TaskCursor == -1) {
		document.getElementById("TimerObj").innerText = "";
	}
}

function FormatTime(TheTime) {
	var seconds = TheTime % 60;
	var minutes = (Math.floor(TheTime / 60) % 60);
	var hours = Math.floor(TheTime / 3600);
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (hours < 10) {
		hours = "0" + hours;
	}
	return hours + ":" + minutes + ":" + seconds;
}

function Tick() {
	if (TaskCursor != -1 && TaskCursor < Tasks.length) {
		Tasks[TaskCursor].Time++;
	}
	DrawClock();
}

function DrawMainTask() {
	if (TaskCursor == -1) {
		document.getElementById("MainTaskObj").innerText = "Press → to Start";
		document.getElementById("Current").classList.remove("Finish");
	} else if (TaskCursor >= Tasks.length) {
		DrawFinish();
	} else {
		document.getElementById("MainTaskObj").innerText = Tasks[TaskCursor].Name;
		document.getElementById("Current").classList.remove("Finish");
	}
	DrawActiveGreen();
	DrawClock();
}

function DrawFinish() {
	document.getElementById("MainTaskObj").innerText = "";
	document.getElementById("TimerObj").innerHTML = "";
	document.getElementById("Current").classList.add("Finish");
	var ResultTable = document.createElement("Table");
	document.getElementById("TimerObj").appendChild(ResultTable);
	var ThisTR = document.createElement("tr");
	ThisTR.style.padding = "10px";
	ResultTable.appendChild(ThisTR);
	var TDTask = document.createElement("th");
	var TDTime = document.createElement("th");
	TDTask.style.color = "black";
	TDTime.style.color = "black";
	TDTask.innerText = "Task";
	TDTime.innerText = "Time";
	ThisTR.appendChild(TDTask);
	ThisTR.appendChild(TDTime);
	var TimeSum = 0;
	for (var i = 0; i < Tasks.length; i++) {
		var ThisTR = document.createElement("tr");
		ThisTR.style.padding = "10px";
		ResultTable.appendChild(ThisTR);
		var TDTask = document.createElement("td");
		var TDTime = document.createElement("td");
		TDTask.innerText = Tasks[i].Name;
		TDTask.style.padding = "10px";
		TDTime.innerText = FormatTime(Tasks[i].Time);
		TDTime.style.padding = "10px";
		ThisTR.appendChild(TDTask);
		ThisTR.appendChild(TDTime);
		TimeSum += Tasks[i].Time;
	}
	var ThisTR = document.createElement("tr");
	ThisTR.style.padding = "10px";
	ResultTable.appendChild(ThisTR);
	var TDTask = document.createElement("th");
	var TDTime = document.createElement("th");
	TDTask.style.color = "black";
	TDTask.innerText = "Total";
	TDTime.style.color = "black";
	TDTime.innerText = FormatTime(TimeSum);
	ThisTR.appendChild(TDTask);
	ThisTR.appendChild(TDTime);
}

function DrawActiveGreen() {
	for (var i = 0; i < Tasks.length; i++) {
		if (i == TaskCursor) {
			Tasks[i].Obj.classList.add("MainTask");
		} else {
			Tasks[i].Obj.classList.remove("MainTask");
		}
	}
}

function Pause() {
	console.log("Paused");
	IsPaused = true;
	document.getElementById("MainTaskObj").innerText = 'Paused.';
	document.getElementById("TimerObj").innerText = "Press any key to continue";
	clearInterval(Clock);
}

function Continue() {
	console.log("Continuing...");
	IsPaused = false;
	DrawMainTask();
	Clock = setInterval(Tick, 1000);
}

function DoKey(event) {
	event.preventDefault();
	var code = event.keyCode || event.which;
	if(IsWorking) {
		DoKeyWork(code);
	}
	else {
		Selector.DoKey(code);
	}
}

function DoKeyWork(code) {
	if (!IsPaused) {
		switch (code) {
			case 39:
				Next();
				break;
			case 37:
				Previous();
				break;
			case 27:
				Pause();
				break;
		}
	} else {
		Continue();
	}
}

function SelectorObject() {
	var that = this;
	that.Tasks = new Array();
	that.TaskCursor = 0;
	
	that.New = function() {
		var ThisTask = that.TaskObj();
		document.getElementById("SelectorTasks").appendChild(ThisTask.Obj);
		that.Tasks.splice(that.TaskCursor+1, 0,ThisTask);
		that.SetOrderToAll();
		return that.TaskCursor + 1;
	}
	
	that.TaskObj = function() {
		var ThisTask = new Object();
		ThisTask.Obj = document.createElement("div");
		ThisTask.Obj.contentEditable = "true";
		ThisTask.Obj.className = "SelectorTask";
		return ThisTask;		
	}
	
	that.SetOrderToAll = function() {
		for(var i = 0;i < that.Tasks.length;i++) {
			that.Tasks[i].Obj.style.order = i;
		}
	}
	
	that.Select = function(ThisTaskIndex) {
		var ThisTask = that.Tasks[ThisTaskIndex];
		that.TaskCursor = ThisTaskIndex;
		ThisTask.Obj.focus();
	}
	
	that.Begin = function() {
		that.New()
		that.Select(0);
		that.TaskCursor = 0;
		setInterval('Selector.Select(Selector.TaskCursor)', 1000);
	}
	
	that.Delete = function(ThisTaskIndex) {
		var ThisTask = that.Tasks[ThisTaskIndex];
		document.getElementById("SelectorTasks").removeChild(ThisTask.Obj);
		that.Tasks.splice(ThisTaskIndex, 1);
		if(that.TaskCursor >= that.Tasks.length) {
			that.TaskCursor = that.Tasks.length-1;
		}
		that.SetOrderToAll();
	}
	
	that.GoToWork = function() {
		document.getElementById("SelectorContainer").classList.add("SectionLeft");
		document.getElementById("MainContainer").classList.remove("SectionRight");
		//Get ready
		for(var i = 0;i < that.Tasks.length; i++) {
			Tasks.push(new Task(that.Tasks[i].Obj.innerText, Tasks.length));
		}
		DrawMainTask();
		Clock = setInterval(Tick, 1000);
		IsPaused = false;
		IsWorking = true;
	}
	
	that.DoKey = function(code) {
		switch (code) {
			case 13:
				if(that.Tasks[that.TaskCursor].Obj.innerText == "") {
					that.Delete(that.TaskCursor);
					that.GoToWork();
				}
				that.Select(that.New());
				break;
			case 38:
				if(that.TaskCursor > 0) {
					that.TaskCursor--;
					that.Select(that.TaskCursor);
				}
				else if(that.TaskCursor == 0) {
					document.getElementById("SelectorHeader").scrollIntoView();
				}
				break;
			case 40:
				if(that.TaskCursor < that.Tasks.length -1) {
					that.TaskCursor++;
					that.Select(that.TaskCursor);
				}
				else if(that.TaskCursor == that.Tasks.length -1) {
					document.getElementById("Watermark").scrollIntoView();
				}
				break;
			case 27:
				if(that.Tasks.length > 1) {
					that.Delete(that.TaskCursor);
					that.Select(that.TaskCursor);
				}
				break;
		}		
	}
}

function Load() {
	Tasks = new Array();

	TaskCursor = -1;
	/*
	DrawMainTask();
	Clock = setInterval(Tick, 1000);
	IsPaused = false;
	*/
	IsWorking = false;
	Selector = new SelectorObject();
	Selector.Begin();
}