function Load() {
	objs = new Array();

	objs.push(new Item("resources/1.png", "Share a bar!", "Why everyone loves chocolate so much? We don't know. Chocolate is not just a simple food, it's one of the great things in life! Chocolate is very very special, why? Click to find out...", "articles/Share-a-Bar/index.html"));
	objs.push(new Item("resources/2.png", "Seeding", "Why are we so rushed? It seems like a good thing, but it's not, because we lose the journey along the way, and Journey is everything.", "articles/Share-a-Bar/index.html"));
	objs.push(new Item("resources/3.png", "桜の大きさ", "こんにちわ！ありがとうございまっす！上げる下さい！", "articles/Share-a-Bar/index.html"));
	objs.push(new Item("resources/4.png", "Tic-Tac-Tic", "It's been an amazing year guys. I want to thank all of you for all of the support you've been giving me. I think it's time to change some things, after all, change is the only constant.", "articles/Tic-Tac-Tic/index.html"));
	objs.push(new Item("resources/5.jpg", "Howdy!!", "Hello! Well, I think I should introduce myself. I'm Daniel Walnut. I like technology, but what I really love is creating technology. That's right! I love to create!", "articles/Share-a-Bar/index.html"));
	
	Categories = new Object();
	
	Categories["All"] = [objs[0], objs[1], objs[2], objs[3], objs[4]];
	Categories["Design"] = [objs[0], objs[1], objs[2], objs[3]];
	Categories["Entrepreneurship"] = [objs[0], objs[3]];
	Categories["Photography"] = [objs[3], objs[4]];
	
	SortItems(objs);
}
