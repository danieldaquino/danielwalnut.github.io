function Load() {
	objs = new Array();

	objs.push(new Item("resources/Corbin/logo.png", "Corbin Hale", "Musicalize your Dreams! A beautiful vintage website and logo.", "CorbinSite"));
	objs.push(new Item("resources/1.png", "Logo Sketches", "Logos are unique and beautiful, they symbolize the values, the virtues of a product. Logo design is one of my favorite kinds of design. Here are some logo sketches I made in the past.", "Logo-Sketches"));
	objs.push(new Item("resources/2.png", "Daisy", "As a gift to another person, I decided to make an artistic gift. Instead of painting on canvas or strumming on a guitar, I decided to use the Web.", "Daisy-Art"));
	objs.push(new Item("resources/6.png", "Deck App", "Last year, I attempted to create a company with some friends, the Deck App.", "Deck-App"));
	//objs.push(new Item("resources/3.png", "桜の大きさ", "こんにちわ！ありがとうございまっす！上げる下さい！", "Share-a-Bar"));
	//objs.push(new Item("resources/4.png", "Tic-Tac-Tic", "It's been an amazing year guys. I want to thank all of you for all of the support you've been giving me. I think it's time to change some things, after all, change is the only constant.", "Tic-Tac-Tic"));
	//objs.push(new Item("resources/5.jpg", "Howdy!!", "Hello! Well, I think I should introduce myself. I'm Daniel Walnut. I like technology, but what I really love is creating technology. That's right! I love to create!", "Share-a-Bar"));
	
	Articles = new Array();
	
	Articles["Tic-Tac-Tic"] = "articles/Tic-Tac-Tic/index.html";
	Articles["Share-a-Bar"] = "articles/Share-a-Bar/index.html";
	Articles["Logo-Sketches"] = "articles/Logo-Sketches/index.html";
	Articles["Daisy-Art"] = "articles/Daisy-Art/index.html";
	Articles["Deck-App"] = "articles/Deck-App/index.html";
	Articles["CorbinSite"] = "articles/CorbinSite/index.html";
	Articles["About-Me"] = "articles/About-Me/index.html";
	Articles["Contact-Me"] = "articles/Contact-Me/index.html";
	
	Categories = new Object();
	
	//Remake Categories
	Categories["All"] = [objs[0], objs[1], objs[2], objs[3]];
	Categories["Design"] = [objs[0], objs[1], objs[2]];
	Categories["Entrepreneurship"] = [objs[0], objs[2]];
	Categories["Photography"] = [objs[1], objs[2]];
	
	Resize();
	SortItems(objs);
	GoHash(location.hash);
}
