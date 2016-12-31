function Task(Name) {
	var that = this;
	that.Done = false;
	that.Name = Name;
	that.Time = 0;
	that.Obj = document.createElement("div");
	that.Obj.classList.add("QueueObject");
	that.Obj.innerText = that.Name;
	document.getElementById("LeftQueue").appendChild(that.Obj);
	that.Do = function() {
		if(!that.Done) {
			document.getElementById("LeftQueue").removeChild(that.Obj);
			document.getElementById("RightQueue").appendChild(that.Obj);
			that.Done = true;
		}
	}
	that.Undo = function() {
		if(that.Done) {
			document.getElementById("RightQueue").removeChild(that.Obj);
			document.getElementById("LeftQueue").appendChild(that.Obj);
			that.Done = false;
		}
	}
}

function Next() {
	if(TaskCursor != Tasks.length - 1) {
		Tasks[TaskCursor].Do();
		TaskCursor++;
		DrawMainTask();
	}
}

function Previous() {
	if(TaskCursor != 0) {
		Tasks[TaskCursor].Undo();
		TaskCursor--;
		DrawMainTask();
	}
}

function DrawClock() {
	var seconds = Tasks[TaskCursor].Time%60;
	var minutes = (Math.floor(Tasks[TaskCursor].Time/60)%60);
	var hours = Math.floor(Tasks[TaskCursor].Time/60);
	if(seconds < 10) {
		seconds = "0" + seconds;
	}
	if(minutes < 10) {
		minutes = "0" + minutes;
	}
	if(hours < 10) {
		hours = "0" + hours;
	}
	document.getElementById("TimerObj").innerText = hours + ":" + minutes + ":" + seconds;
}

function Tick() {
	Tasks[TaskCursor].Time++;
}

function DrawMainTask() {
	document.getElementById("MainTaskObj").innerText = Tasks[TaskCursor].Name;
}

function DoKey(e) {
	switch(e.keyCode) {
		case 39:
			Next();
			break;
		case 37:
			Previous();
			break;
		
	}
}

function Load() {
	Tasks = new Array();

	Tasks.push(new Task("Do Schematics"));
	Tasks.push(new Task("Wire the Circuit"));
	Tasks.push(new Task("Troubleshoot"));
	Tasks.push(new Task("Fill in truth table"));

	TaskCursor = 0;
	setInterval(Tick, 1000);	
}