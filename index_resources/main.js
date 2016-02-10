var IsMobile = false;

function Item(Thumb, TheTitle, Description, TheURL) {
	var that = this;
	
	this.URL = TheURL;
	
	this.__defineSetter__("Active", function(x){
		if(x)
		{
			that.Obj.style.opacity = 1;
		}
		else
		{
			that.Obj.style.opacity = 0;
		}
	});
	this.__defineGetter__("Active", function(x){
			if(parseInt(that.Obj.style.opacity) == 0)
			{
				return false;
			}
			else
			{
				return true;
			}
	});
	this.Obj = document.createElement("div");
	this.Obj.className = "generic_obj";
	this.Obj.addEventListener("click", function() {
		LoadText(that.URL);
		ShowText();
	});
	document.getElementById("list_wrapper").appendChild(this.Obj);

	this.Thumb = document.createElement("div");
	this.Thumb.className = "a_thumbnail";
	this.Thumb.style.background = "url(" + Thumb + ")";
	this.Thumb.style.backgroundSize = "cover";
	this.Thumb.style.backgroundRepeat = "no-repeat";
	this.Thumb.style.backgroundPosition = "center";
	this.Obj.appendChild(this.Thumb);

	this.Title = document.createElement("h2");
	this.Title.innerText = TheTitle;
	this.Obj.appendChild(this.Title);

	this.Description = document.createElement("p");
	this.Description.innerText = Description;
	this.Description.style.textOverflow = "ellipsis";
	this.Obj.appendChild(this.Description);

}

function SortItems(theobjs)
{
	for(var i=j=0; i<theobjs.length; i++)
	{
		if(theobjs[i].Active)
		{
			theobjs[i].Obj.style.display = "block";
			if(!IsMobile)
			{
				theobjs[i].Obj.style.left =  (((j%2) == 1)?24:0) + 372*(j%2);
				theobjs[i].Obj.style.top = 572*(Math.floor(j/2));
			}
			else
			{
				theobjs[i].Obj.style.left = 202;
				theobjs[i].Obj.style.top = 572*j;
			}
			j++;
		}
		else
		{
			var Passobj = theobjs[i];
			setTimeout((function(){
				this.Obj.style.display = "none";
			}).bind(Passobj), 500);
		}
	}
}

function FilterItems(theobjs, categories, category)
{
	for(var i=0;i<theobjs.length;i++)
	{
		theobjs[i].Active = false;
	}
	
	for(var i = 0;i<categories[category].length; i++)
	{
		categories[category][i].Active = true;
	}
	SortItems(theobjs);
}

function ShowMenu()
{
	document.getElementById("side_bar_modal").className = "side_bar_modal_show";
	document.getElementById("side_bar").className = "side_bar_show";
}

function HideMenu()
{
	document.getElementById("side_bar_modal").className = "side_bar_modal_hidden";
	document.getElementById("side_bar").className = "side_bar_hidden";
}

function ShowPhoto()
{
	document.getElementById("logo_image").src = "index_resources/face.png";	
}

function ShowLogo()
{
	document.getElementById("logo_image").src = "index_resources/logo.png";
}

function CloseText()
{
	document.getElementById("text-content-wrapper").className = "text-closed";
	document.getElementById("content_wrapper").className = "content_wrapper_open";
}

function ShowText()
{
	document.getElementById("text-content-wrapper").className = "text-open";
	document.getElementById("content_wrapper").className = "content_wrapper_closed";
}

function LoadText(TheURL)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (xhttp.readyState == 4 && xhttp.status == 200)
		{
			document.getElementById("text-content").innerHTML = xhttp.responseText;
		}
	};
	xhttp.open("GET", TheURL, true);
	xhttp.send();
}