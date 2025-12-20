// Premade bracket lists organized by category and size
export interface PremadeList {
	category: string;
	size: number;
	items: string[];
}

const categories = {
	fruits: [
		'Apple', 'Banana', 'Orange', 'Grape', 'Strawberry', 'Mango', 'Pineapple', 'Watermelon',
		'Peach', 'Pear', 'Cherry', 'Blueberry', 'Raspberry', 'Kiwi', 'Papaya', 'Coconut',
		'Lemon', 'Lime', 'Pomegranate', 'Dragon Fruit', 'Lychee', 'Passion Fruit', 'Guava', 'Fig',
		'Plum', 'Apricot', 'Nectarine', 'Cantaloupe', 'Honeydew', 'Blackberry', 'Cranberry', 'Date',
		'Persimmon', 'Star Fruit', 'Jackfruit', 'Rambutan', 'Longan', 'Mangosteen', 'Durian', 'Acerola',
		'Breadfruit', 'Soursop', 'Feijoa', 'Quince', 'Elderberry', 'Gooseberry', 'Currant', 'Mulberry',
		'Boysenberry', 'Cloudberry', 'Huckleberry', 'Serviceberry', 'Jabuticaba', 'Salak', 'Tamarillo', 'Ugli Fruit',
		'Yuzu', 'Kumquat', 'Loquat', 'Medlar', 'Jujube', 'Akee', 'Bilberry', 'Chokeberry',
		'Rowan', 'Hawthorn', 'Rose Hip', 'Sea Buckthorn', 'Barberry', 'Goji Berry', 'Acai', 'Maqui Berry',
		'Camu Camu', 'Amla', 'Baobab', 'Monk Fruit', 'Miracle Fruit', 'Buddha Hand', 'Finger Lime', 'Blood Orange',
		'Cara Cara', 'Tangelo', 'Minneola', 'Clementine', 'Satsuma', 'Yuzu', 'Bergamot', 'Grapefruit',
		'Pomelo', 'Ugli', 'Tangerine', 'Mandarin', 'Kumquat', 'Calamondin', 'Limequat', 'Orangequat'
	],
	vegetables: [
		'Broccoli', 'Carrot', 'Spinach', 'Tomato', 'Potato', 'Onion', 'Bell Pepper', 'Cucumber',
		'Lettuce', 'Celery', 'Cabbage', 'Cauliflower', 'Brussels Sprouts', 'Asparagus', 'Zucchini', 'Eggplant',
		'Corn', 'Peas', 'Green Beans', 'Mushroom', 'Radish', 'Beet', 'Sweet Potato', 'Kale',
		'Collard Greens', 'Swiss Chard', 'Arugula', 'Bok Choy', 'Kohlrabi', 'Turnip', 'Rutabaga', 'Parsnip',
		'Fennel', 'Artichoke', 'Leek', 'Shallot', 'Garlic', 'Ginger', 'Turmeric', 'Horseradish',
		'Daikon', 'Jicama', 'Kohlrabi', 'Celeriac', 'Sunchoke', 'Salsify', 'Burdock', 'Lotus Root',
		'Taro', 'Yam', 'Cassava', 'Plantain', 'Okra', 'Chayote', 'Squash', 'Pumpkin',
		'Butternut Squash', 'Acorn Squash', 'Spaghetti Squash', 'Delicata', 'Kabocha', 'Pattypan', 'Zucchini', 'Yellow Squash',
		'Cucumber', 'Pickle', 'Gherkin', 'Cornichon', 'Luffa', 'Bitter Melon', 'Wax Gourd', 'Snake Gourd',
		'Ridge Gourd', 'Sponge Gourd', 'Bottle Gourd', 'Ash Gourd', 'Pointed Gourd', 'Ivy Gourd', 'Tinda', 'Parwal'
	],
	movies: [
		'The Godfather', 'The Shawshank Redemption', 'Pulp Fiction', 'The Dark Knight', 'Fight Club', 'Inception', 'Goodfellas', 'The Matrix',
		'Forrest Gump', 'The Lord of the Rings', 'Star Wars', 'Titanic', 'Avatar', 'Jurassic Park', 'The Avengers', 'Interstellar',
		'Gladiator', 'The Departed', 'The Prestige', 'Memento', 'Se7en', 'The Usual Suspects', 'The Silence of the Lambs', 'Schindler\'s List',
		'Saving Private Ryan', 'The Green Mile', 'The Lion King', 'Toy Story', 'Finding Nemo', 'Up', 'Wall-E', 'Ratatouille',
		'Monsters Inc', 'Inside Out', 'Coco', 'Moana', 'Frozen', 'Tangled', 'The Incredibles', 'Shrek',
		'Mad Max: Fury Road', 'Django Unchained', 'Inglourious Basterds', 'Kill Bill', 'Reservoir Dogs', 'Once Upon a Time in Hollywood', 'The Hateful Eight', 'Death Proof',
		'Blade Runner', 'Blade Runner 2049', 'Alien', 'Aliens', 'Terminator', 'Terminator 2', 'Predator', 'The Thing',
		'2001: A Space Odyssey', 'A Clockwork Orange', 'The Shining', 'Full Metal Jacket', 'Eyes Wide Shut', 'Barry Lyndon', 'Dr. Strangelove', 'Paths of Glory',
		'Casablanca', 'Citizen Kane', 'Gone with the Wind', 'Lawrence of Arabia', 'Vertigo', 'Psycho', 'North by Northwest', 'Rear Window',
		'The Wizard of Oz', 'Singin\' in the Rain', 'Some Like It Hot', 'Sunset Boulevard', 'All About Eve', 'Roman Holiday', 'Breakfast at Tiffany\'s', 'My Fair Lady',
		'Rocky', 'Raging Bull', 'Apocalypse Now', 'Taxi Driver', 'The Deer Hunter', 'Platoon', 'Full Metal Jacket', 'Black Hawk Down',
		'Heat', 'Collateral', 'Miami Vice', 'Thief', 'Manhunter', 'Public Enemies', 'The Insider', 'Ali'
	],
	tvShows: [
		'Breaking Bad', 'Game of Thrones', 'The Sopranos', 'The Wire', 'Friends', 'The Office', 'Stranger Things', 'The Crown',
		'Better Call Saul', 'Succession', 'The Last of Us', 'House of the Dragon', 'The White Lotus', 'Severance', 'Yellowjackets', 'Squid Game',
		'True Detective', 'Fargo', 'Chernobyl', 'Band of Brothers', 'The Pacific', 'Generation Kill', 'The Night Of', 'Mare of Easttown',
		'Mad Men', 'Boardwalk Empire', 'Deadwood', 'Rome', 'Spartacus', 'Vikings', 'The Last Kingdom', 'Peaky Blinders',
		'Lost', 'Lost', 'Prison Break', '24', 'Homeland', 'The Americans', 'Jack Ryan', 'Tom Clancy\'s Without Remorse',
		'The West Wing', 'The Newsroom', 'Veep', 'Parks and Recreation', '30 Rock', 'Arrested Development', 'Community', 'It\'s Always Sunny in Philadelphia',
		'Seinfeld', 'Curb Your Enthusiasm', 'The Larry Sanders Show', 'Entourage', 'Californication', 'Weeds', 'Shameless', 'Orange is the New Black',
		'House', 'Grey\'s Anatomy', 'ER', 'Scrubs', 'The Good Doctor', 'New Amsterdam', 'Chicago Med', 'The Resident',
		'Law & Order', 'Law & Order: SVU', 'CSI', 'NCIS', 'Criminal Minds', 'Bones', 'Dexter', 'True Blood',
		'The X-Files', 'Twin Peaks', 'The Twilight Zone', 'Black Mirror', 'Love, Death & Robots', 'Electric Dreams', 'Inside No. 9', 'The Outer Limits',
		'Doctor Who', 'Star Trek: TNG', 'Star Trek: DS9', 'Star Trek: Voyager', 'Battlestar Galactica', 'The Expanse', 'Firefly', 'Stargate SG-1',
		'The Walking Dead', 'Fear the Walking Dead', 'Z Nation', 'iZombie', 'Santa Clarita Diet', 'Ash vs Evil Dead', 'Preacher', 'The Boys',
		'Supernatural', 'Buffy the Vampire Slayer', 'Angel', 'Charmed', 'The Magicians', 'The Witcher', 'Shadow and Bone', 'Locke & Key'
	],
	sports: [
		'Football', 'Basketball', 'Baseball', 'Soccer', 'Tennis', 'Golf', 'Hockey', 'Volleyball',
		'Swimming', 'Track and Field', 'Boxing', 'MMA', 'Wrestling', 'Cycling', 'Rowing', 'Sailing',
		'Surfing', 'Snowboarding', 'Skiing', 'Ice Skating', 'Figure Skating', 'Curling', 'Bobsled', 'Luge',
		'Rugby', 'Cricket', 'Badminton', 'Table Tennis', 'Ping Pong', 'Racquetball', 'Squash', 'Lacrosse',
		'Field Hockey', 'Water Polo', 'Diving', 'Synchronized Swimming', 'Water Skiing', 'Wakeboarding', 'Kitesurfing', 'Windsurfing',
		'Rock Climbing', 'Mountaineering', 'Hiking', 'Trail Running', 'Ultramarathon', 'Triathlon', 'Ironman', 'Marathon',
		'CrossFit', 'Powerlifting', 'Weightlifting', 'Bodybuilding', 'Strongman', 'Arm Wrestling', 'Tug of War', 'Highland Games',
		'Fencing', 'Archery', 'Shooting', 'Biathlon', 'Pentathlon', 'Decathlon', 'Heptathlon', 'Modern Pentathlon',
		'Gymnastics', 'Rhythmic Gymnastics', 'Trampoline', 'Parkour', 'Freerunning', 'Breakdancing', 'Cheerleading', 'Acrobatics',
		'Skateboarding', 'BMX', 'Motocross', 'Rally Racing', 'Formula 1', 'NASCAR', 'IndyCar', 'MotoGP',
		'Ultimate Frisbee', 'Disc Golf', 'Frisbee', 'Quidditch', 'Underwater Hockey', 'Sepak Takraw', 'Kabaddi', 'Hurling',
		'Australian Rules Football', 'Gaelic Football', 'Handball', 'Team Handball', 'Beach Volleyball', 'Beach Soccer', 'Futsal', 'Street Soccer',
		'Kickboxing', 'Muay Thai', 'Jiu-Jitsu', 'Judo', 'Karate', 'Taekwondo', 'Kung Fu', 'Aikido',
		'Sumo', 'Kendo', 'Fencing', 'Equestrian', 'Polo', 'Dressage', 'Show Jumping', 'Eventing'
	],
	animals: [
		'Lion', 'Tiger', 'Bear', 'Elephant', 'Giraffe', 'Zebra', 'Rhino', 'Hippo',
		'Cheetah', 'Leopard', 'Jaguar', 'Panther', 'Puma', 'Cougar', 'Lynx', 'Bobcat',
		'Wolf', 'Fox', 'Coyote', 'Hyena', 'Wild Dog', 'Dingo', 'Jackal', 'African Wild Dog',
		'Gorilla', 'Chimpanzee', 'Orangutan', 'Bonobo', 'Gibbon', 'Baboon', 'Macaque', 'Marmoset',
		'Dolphin', 'Whale', 'Shark', 'Octopus', 'Squid', 'Jellyfish', 'Stingray', 'Manta Ray',
		'Eagle', 'Hawk', 'Falcon', 'Owl', 'Vulture', 'Condor', 'Albatross', 'Pelican',
		'Penguin', 'Seal', 'Walrus', 'Sea Lion', 'Otter', 'Beaver', 'Muskrat', 'Capybara',
		'Kangaroo', 'Koala', 'Wombat', 'Tasmanian Devil', 'Platypus', 'Echidna', 'Wallaby', 'Quokka',
		'Panda', 'Red Panda', 'Sloth', 'Anteater', 'Armadillo', 'Aardvark', 'Pangolin', 'Tapir',
		'Camel', 'Llama', 'Alpaca', 'Vicuna', 'Guanaco', 'Dromedary', 'Bactrian Camel', 'Yak',
		'Bison', 'Buffalo', 'Moose', 'Elk', 'Deer', 'Reindeer', 'Caribou', 'Antelope',
		'Gazelle', 'Impala', 'Springbok', 'Wildebeest', 'Eland', 'Kudu', 'Oryx', 'Gemsbok',
		'Polar Bear', 'Grizzly Bear', 'Black Bear', 'Panda Bear', 'Sun Bear', 'Sloth Bear', 'Spectacled Bear', 'Brown Bear',
		'Polar Bear', 'Grizzly Bear', 'Black Bear', 'Panda Bear', 'Sun Bear', 'Sloth Bear', 'Spectacled Bear', 'Brown Bear'
	],
	countries: [
		'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru',
		'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Netherlands', 'Belgium',
		'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland', 'Ireland',
		'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece', 'Turkey', 'Russia',
		'China', 'Japan', 'South Korea', 'India', 'Thailand', 'Vietnam', 'Indonesia', 'Philippines',
		'Malaysia', 'Singapore', 'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Samoa', 'Tonga',
		'South Africa', 'Egypt', 'Kenya', 'Morocco', 'Nigeria', 'Ghana', 'Tanzania', 'Ethiopia',
		'Israel', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Jordan', 'Lebanon', 'Iran',
		'Iraq', 'Afghanistan', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Myanmar', 'Cambodia', 'Laos',
		'Mongolia', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Azerbaijan', 'Armenia',
		'Georgia', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'Moldova', 'Slovakia',
		'Slovenia', 'Croatia', 'Serbia', 'Bosnia', 'Montenegro', 'Macedonia', 'Albania', 'Kosovo',
		'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Trinidad and Tobago', 'Barbados', 'Bahamas',
		'Panama', 'Costa Rica', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Belize', 'Guyana',
		'Suriname', 'French Guiana', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Falkland Islands'
	],
	cars: [
		'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen',
		'Porsche', 'Ferrari', 'Lamborghini', 'McLaren', 'Aston Martin', 'Bentley', 'Rolls-Royce', 'Maserati',
		'Lexus', 'Acura', 'Infiniti', 'Cadillac', 'Lincoln', 'Buick', 'Chrysler', 'Dodge',
		'Jeep', 'Ram', 'GMC', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'Hyundai',
		'Kia', 'Genesis', 'Volvo', 'Jaguar', 'Land Rover', 'Range Rover', 'Mini', 'Fiat',
		'Alfa Romeo', 'Peugeot', 'Renault', 'Citroen', 'Opel', 'Skoda', 'Seat', 'Dacia',
		'Tesla', 'Rivian', 'Lucid', 'Polestar', 'Nio', 'BYD', 'Xpeng', 'Li Auto',
		'Pagani', 'Koenigsegg', 'Bugatti', 'Rimac', 'Pininfarina', 'Lotus', 'Caterham', 'Ariel',
		'Morgan', 'Noble', 'Gumpert', 'Spyker', 'Wiesmann', 'Donkervoort', 'RUF', 'TechArt',
		'Brabus', 'AMG', 'M', 'RS', 'S', 'Type R', 'Nismo', 'TRD',
		'Shelby', 'Hennessey', 'Saleen', 'Roush', 'Callaway', 'Lingenfelter', 'SVE', 'SVT',
		'Abarth', 'Alpina', 'Brabus', 'Carlsson', 'Hamann', 'Mansory', 'Novitec', 'Prior Design',
		'RevoZport', 'Startech', 'Wald', 'Yokohama', 'Work', 'Rays', 'Enkei', 'BBS'
	],
	foods: [
		'Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta', 'Ramen', 'Curry', 'Stir Fry',
		'Steak', 'Chicken', 'Fish', 'Salmon', 'Shrimp', 'Lobster', 'Crab', 'Oysters',
		'BBQ', 'Ribs', 'Brisket', 'Pulled Pork', 'Chicken Wings', 'Fried Chicken', 'Turkey', 'Duck',
		'Lasagna', 'Ravioli', 'Spaghetti', 'Fettuccine', 'Penne', 'Macaroni', 'Rigatoni', 'Linguine',
		'Pad Thai', 'Pad See Ew', 'Tom Yum', 'Green Curry', 'Massaman', 'Panang', 'Red Curry', 'Yellow Curry',
		'Burrito', 'Quesadilla', 'Enchilada', 'Tamale', 'Nachos', 'Chimichanga', 'Fajita', 'Tostada',
		'Fried Rice', 'Lo Mein', 'Kung Pao', 'General Tso\'s', 'Orange Chicken', 'Sweet and Sour', 'Mongolian Beef', 'Mapo Tofu',
		'Risotto', 'Paella', 'Gazpacho', 'Tapas', 'Churrasco', 'Feijoada', 'Ceviche', 'Empanada',
		'Pho', 'Banh Mi', 'Spring Rolls', 'Summer Rolls', 'Bun Cha', 'Com Tam', 'Banh Xeo', 'Goi Cuon',
		'Dumplings', 'Xiao Long Bao', 'Char Siu Bao', 'Har Gow', 'Siu Mai', 'Wonton', 'Pot Stickers', 'Spring Rolls',
		'Kebab', 'Shawarma', 'Falafel', 'Hummus', 'Baba Ganoush', 'Tabbouleh', 'Fattoush', 'Manakish',
		'Biryani', 'Butter Chicken', 'Tikka Masala', 'Vindaloo', 'Rogan Josh', 'Korma', 'Saag Paneer', 'Dal Makhani',
		'Goulash', 'Schnitzel', 'Bratwurst', 'Sauerkraut', 'Pretzel', 'Strudel', 'Spaetzle', 'Knoedel',
		'Borscht', 'Pelmeni', 'Pierogi', 'Golubtsy', 'Shashlik', 'Beef Stroganoff', 'Chicken Kiev', 'Olivier Salad'
	],
	colors: [
		'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown',
		'Black', 'White', 'Gray', 'Silver', 'Gold', 'Navy', 'Teal', 'Turquoise',
		'Coral', 'Salmon', 'Peach', 'Lavender', 'Lilac', 'Magenta', 'Maroon', 'Burgundy',
		'Crimson', 'Scarlet', 'Vermillion', 'Carmine', 'Rose', 'Fuchsia', 'Cerise', 'Ruby',
		'Sapphire', 'Azure', 'Cobalt', 'Indigo', 'Violet', 'Amethyst', 'Lavender', 'Periwinkle',
		'Emerald', 'Jade', 'Mint', 'Lime', 'Chartreuse', 'Olive', 'Forest', 'Hunter',
		'Beige', 'Tan', 'Khaki', 'Cream', 'Ivory', 'Pearl', 'Champagne', 'Bisque',
		'Charcoal', 'Slate', 'Gunmetal', 'Platinum', 'Titanium', 'Bronze', 'Copper', 'Brass',
		'Cyan', 'Aqua', 'Sky Blue', 'Baby Blue', 'Powder Blue', 'Royal Blue', 'Navy Blue', 'Midnight Blue',
		'Lemon', 'Canary', 'Amber', 'Gold', 'Mustard', 'Honey', 'Butter', 'Vanilla',
		'Cinnamon', 'Chocolate', 'Coffee', 'Mocha', 'Espresso', 'Caramel', 'Toffee', 'Hazelnut',
		'Peach', 'Apricot', 'Tangerine', 'Persimmon', 'Papaya', 'Mango', 'Pineapple', 'Banana',
		'Lime', 'Kiwi', 'Avocado', 'Olive', 'Forest Green', 'Sage', 'Mint', 'Seafoam',
		'Turquoise', 'Teal', 'Cyan', 'Aquamarine', 'Periwinkle', 'Lavender', 'Lilac', 'Wisteria',
		'Plum', 'Eggplant', 'Grape', 'Amethyst', 'Violet', 'Orchid', 'Fuchsia', 'Magenta'
	],
	superheroes: [
		'Superman', 'Batman', 'Wonder Woman', 'Spider-Man', 'Iron Man', 'Captain America', 'Thor', 'Hulk',
		'Black Widow', 'Hawkeye', 'Black Panther', 'Doctor Strange', 'Ant-Man', 'Wasp', 'Captain Marvel', 'Scarlet Witch',
		'Vision', 'Falcon', 'Winter Soldier', 'War Machine', 'Star-Lord', 'Gamora', 'Drax', 'Rocket',
		'Groot', 'Nebula', 'Mantis', 'Yondu', 'Deadpool', 'Wolverine', 'Storm', 'Jean Grey',
		'Cyclops', 'Nightcrawler', 'Colossus', 'Iceman', 'Beast', 'Angel', 'Rogue', 'Gambit',
		'Magneto', 'Professor X', 'Mystique', 'Sabretooth', 'Juggernaut', 'Apocalypse', 'Mr. Sinister', 'Omega Red',
		'Flash', 'Green Lantern', 'Aquaman', 'Martian Manhunter', 'Green Arrow', 'Black Canary', 'Shazam', 'Cyborg',
		'Nightwing', 'Robin', 'Red Hood', 'Batgirl', 'Catwoman', 'Harley Quinn', 'Poison Ivy', 'Joker',
		'Lex Luthor', 'Darkseid', 'Doomsday', 'Brainiac', 'Sinestro', 'Atrocitus', 'Larfleeze', 'Star Sapphire',
		'Thanos', 'Loki', 'Ultron', 'Red Skull', 'Doctor Doom', 'Magneto', 'Green Goblin', 'Venom',
		'Carnage', 'Kingpin', 'Bullseye', 'Electro', 'Sandman', 'Rhino', 'Vulture', 'Mysterio',
		'Killmonger', 'Erik Killmonger', 'Namor', 'Doctor Doom', 'Silver Surfer', 'Galactus', 'Apocalypse', 'Onslaught',
		'Daredevil', 'Punisher', 'Blade', 'Ghost Rider', 'Moon Knight', 'Iron Fist', 'Luke Cage', 'Jessica Jones',
		'She-Hulk', 'Ms. Marvel', 'Squirrel Girl', 'Gwenpool', 'America Chavez', 'Nova', 'Blue Marvel', 'Spectrum',
		'Storm', 'Jean Grey', 'Rogue', 'Kitty Pryde', 'Emma Frost', 'Psylocke', 'Jubilee', 'Dazzler'
	],
	videoGames: [
		'Mario', 'Zelda', 'Pokemon', 'Sonic', 'Minecraft', 'Fortnite', 'Call of Duty', 'Halo',
		'GTA', 'Red Dead Redemption', 'The Last of Us', 'God of War', 'Uncharted', 'Spider-Man', 'Batman Arkham', 'Assassin\'s Creed',
		'Elder Scrolls', 'Fallout', 'Witcher', 'Dark Souls', 'Bloodborne', 'Sekiro', 'Elden Ring', 'Demon\'s Souls',
		'Final Fantasy', 'Kingdom Hearts', 'Persona', 'Dragon Quest', 'Fire Emblem', 'Xenoblade', 'Tales', 'Star Ocean',
		'Street Fighter', 'Mortal Kombat', 'Tekken', 'Super Smash Bros', 'Guilty Gear', 'King of Fighters', 'BlazBlue', 'Dragon Ball FighterZ',
		'FIFA', 'Madden', 'NBA 2K', 'MLB The Show', 'NHL', 'Rocket League', 'Gran Turismo', 'Forza',
		'Resident Evil', 'Silent Hill', 'Dead Space', 'Outlast', 'Amnesia', 'Until Dawn', 'The Quarry', 'Alan Wake',
		'Mass Effect', 'Dragon Age', 'Baldur\'s Gate', 'Divinity', 'Pillars of Eternity', 'Pathfinder', 'Wasteland', 'Torment',
		'Starcraft', 'Warcraft', 'Age of Empires', 'Civilization', 'Total War', 'Crusader Kings', 'Europa Universalis', 'Hearts of Iron',
		'Counter-Strike', 'Valorant', 'Rainbow Six', 'Overwatch', 'Apex Legends', 'PUBG', 'Warzone', 'Destiny',
		'World of Warcraft', 'Final Fantasy XIV', 'Guild Wars', 'Elder Scrolls Online', 'Black Desert', 'Lost Ark', 'New World', 'Albion Online',
		'Animal Crossing', 'Stardew Valley', 'Harvest Moon', 'Story of Seasons', 'My Time at Portia', 'Rune Factory', 'Graveyard Keeper', 'Spiritfarer',
		'Portal', 'Half-Life', 'BioShock', 'Dishonored', 'Prey', 'Deus Ex', 'System Shock', 'Thief',
		'Doom', 'Quake', 'Wolfenstein', 'Serious Sam', 'Painkiller', 'Bulletstorm', 'Shadow Warrior', 'Ion Fury'
	],
	musicians: [
		'Beatles', 'Rolling Stones', 'Led Zeppelin', 'Pink Floyd', 'Queen', 'The Who', 'The Doors', 'Jimi Hendrix',
		'Bob Dylan', 'David Bowie', 'Prince', 'Michael Jackson', 'Madonna', 'Elvis Presley', 'Frank Sinatra', 'Ella Fitzgerald',
		'Louis Armstrong', 'Duke Ellington', 'Miles Davis', 'John Coltrane', 'Charlie Parker', 'Thelonious Monk', 'Billie Holiday', 'Nina Simone',
		'Aretha Franklin', 'Stevie Wonder', 'Marvin Gaye', 'Ray Charles', 'Otis Redding', 'Sam Cooke', 'James Brown', 'Al Green',
		'Bob Marley', 'Bob Marley and the Wailers', 'Peter Tosh', 'Bunny Wailer', 'Jimmy Cliff', 'Toots and the Maytals', 'Desmond Dekker', 'The Skatalites',
		'Radiohead', 'Nirvana', 'Pearl Jam', 'Soundgarden', 'Alice in Chains', 'Stone Temple Pilots', 'Foo Fighters', 'Red Hot Chili Peppers',
		'U2', 'Coldplay', 'Oasis', 'Blur', 'The Smiths', 'Joy Division', 'New Order', 'The Cure',
		'Depeche Mode', 'New Order', 'Pet Shop Boys', 'Erasure', 'Yazoo', 'Orchestral Manoeuvres', 'Kraftwerk', 'Tangerine Dream',
		'Metallica', 'Iron Maiden', 'Black Sabbath', 'Judas Priest', 'Motorhead', 'Slayer', 'Megadeth', 'Anthrax',
		'AC/DC', 'Guns N\' Roses', 'Aerosmith', 'Van Halen', 'Def Leppard', 'Bon Jovi', 'Journey', 'Foreigner',
		'Kanye West', 'Jay-Z', 'Eminem', 'Drake', 'Kendrick Lamar', 'J. Cole', 'Nas', 'Tupac',
		'Biggie', 'Snoop Dogg', 'Dr. Dre', 'Ice Cube', 'Public Enemy', 'Wu-Tang Clan', 'A Tribe Called Quest', 'De La Soul',
		'Daft Punk', 'Deadmau5', 'Skrillex', 'Avicii', 'Swedish House Mafia', 'Calvin Harris', 'David Guetta', 'Tiesto',
		'Aphex Twin', 'Boards of Canada', 'Autechre', 'Squarepusher', 'Flying Lotus', 'Four Tet', 'Caribou', 'Bonobo'
	],
	books: [
		'1984', 'To Kill a Mockingbird', 'The Great Gatsby', 'Pride and Prejudice', 'The Catcher in the Rye', 'Lord of the Flies', 'Animal Farm', 'Brave New World',
		'Harry Potter', 'The Hobbit', 'The Lord of the Rings', 'Game of Thrones', 'Dune', 'Foundation', 'Ender\'s Game', 'The Hunger Games',
		'The Chronicles of Narnia', 'His Dark Materials', 'Percy Jackson', 'Twilight', 'The Maze Runner', 'Divergent', 'The Giver', 'The Book Thief',
		'War and Peace', 'Anna Karenina', 'Crime and Punishment', 'The Brothers Karamazov', 'One Hundred Years of Solitude', 'Love in the Time of Cholera', 'The Alchemist', 'Don Quixote',
		'Moby Dick', 'The Adventures of Huckleberry Finn', 'The Adventures of Tom Sawyer', 'The Scarlet Letter', 'The Grapes of Wrath', 'Of Mice and Men', 'East of Eden', 'Cannery Row',
		'Jane Eyre', 'Wuthering Heights', 'Frankenstein', 'Dracula', 'The Picture of Dorian Gray', 'The Strange Case of Dr. Jekyll and Mr. Hyde', 'The Time Machine', 'The War of the Worlds',
		'The Odyssey', 'The Iliad', 'The Aeneid', 'The Divine Comedy', 'Paradise Lost', 'Beowulf', 'The Canterbury Tales', 'Le Morte d\'Arthur',
		'The Count of Monte Cristo', 'The Three Musketeers', 'Les Misérables', 'The Hunchback of Notre-Dame', 'Around the World in 80 Days', 'Journey to the Center of the Earth', 'Twenty Thousand Leagues', 'The Mysterious Island',
		'Sherlock Holmes', 'Agatha Christie', 'Stephen King', 'Dean Koontz', 'Clive Barker', 'H.P. Lovecraft', 'Edgar Allan Poe', 'Ray Bradbury',
		'Isaac Asimov', 'Arthur C. Clarke', 'Philip K. Dick', 'Robert Heinlein', 'Frank Herbert', 'Ursula K. Le Guin', 'Octavia Butler', 'Margaret Atwood',
		'J.R.R. Tolkien', 'C.S. Lewis', 'George R.R. Martin', 'Brandon Sanderson', 'Patrick Rothfuss', 'Joe Abercrombie', 'Scott Lynch', 'Brent Weeks',
		'Dan Brown', 'John Grisham', 'Michael Crichton', 'Tom Clancy', 'Lee Child', 'David Baldacci', 'James Patterson', 'Harlan Coben',
		'Jane Austen', 'Charlotte Brontë', 'Emily Brontë', 'Virginia Woolf', 'Toni Morrison', 'Maya Angelou', 'Zora Neale Hurston', 'Alice Walker',
		'Ernest Hemingway', 'F. Scott Fitzgerald', 'William Faulkner', 'John Steinbeck', 'Mark Twain', 'Edgar Allan Poe', 'Walt Whitman', 'Emily Dickinson'
	],
	desserts: [
		'Chocolate Cake', 'Vanilla Cake', 'Cheesecake', 'Ice Cream', 'Brownies', 'Cookies', 'Pie', 'Pudding',
		'Tiramisu', 'Crème Brûlée', 'Flan', 'Panna Cotta', 'Mousse', 'Soufflé', 'Tart', 'Éclair',
		'Cannoli', 'Baklava', 'Gulab Jamun', 'Kulfi', 'Rasgulla', 'Jalebi', 'Ladoo', 'Barfi',
		'Macarons', 'Madeleines', 'Profiteroles', 'Cream Puffs', 'Beignets', 'Donuts', 'Cronut', 'Churros',
		'Apple Pie', 'Pecan Pie', 'Pumpkin Pie', 'Cherry Pie', 'Key Lime Pie', 'Lemon Meringue', 'Banana Cream', 'Coconut Cream',
		'Red Velvet', 'Carrot Cake', 'German Chocolate', 'Black Forest', 'Opera Cake', 'Sacher Torte', 'Dobos Torte', 'Linzer Torte',
		'Strawberry Shortcake', 'Pound Cake', 'Angel Food', 'Devil\'s Food', 'Funfetti', 'Confetti', 'Birthday Cake', 'Wedding Cake',
		'Chocolate Chip Cookies', 'Oatmeal Raisin', 'Snickerdoodles', 'Sugar Cookies', 'Peanut Butter', 'Double Chocolate', 'White Chocolate Macadamia', 'Gingerbread',
		'Fudge', 'Truffles', 'Bonbons', 'Pralines', 'Caramels', 'Toffee', 'Nougat', 'Marshmallows',
		'Gelato', 'Sorbet', 'Sherbet', 'Frozen Yogurt', 'Frozen Custard', 'Soft Serve', 'Milkshake', 'Smoothie',
		'Cupcakes', 'Whoopie Pies', 'Moon Pies', 'Twinkies', 'Ho Hos', 'Ding Dongs', 'Zingers', 'Swiss Rolls',
		'Lava Cake', 'Molten Chocolate', 'Chocolate Fondant', 'Sticky Toffee Pudding', 'Bread Pudding', 'Rice Pudding', 'Tapioca', 'Custard',
		'Cobbler', 'Crisp', 'Crumble', 'Buckle', 'Betty', 'Pandowdy', 'Grunt', 'Slump',
		'Affogato', 'Espresso', 'Cappuccino', 'Latte', 'Mocha', 'Frappuccino', 'Milkshake', 'Smoothie'
	],
	drinks: [
		'Water', 'Coffee', 'Tea', 'Juice', 'Soda', 'Beer', 'Wine', 'Whiskey',
		'Coca-Cola', 'Pepsi', 'Sprite', 'Fanta', 'Dr. Pepper', 'Root Beer', 'Ginger Ale', 'Club Soda',
		'Orange Juice', 'Apple Juice', 'Cranberry Juice', 'Grape Juice', 'Pineapple Juice', 'Tomato Juice', 'Carrot Juice', 'Beet Juice',
		'Espresso', 'Cappuccino', 'Latte', 'Americano', 'Macchiato', 'Mocha', 'Frappuccino', 'Cold Brew',
		'Green Tea', 'Black Tea', 'White Tea', 'Oolong', 'Earl Grey', 'Chai', 'Matcha', 'Jasmine',
		'Red Wine', 'White Wine', 'Rosé', 'Champagne', 'Prosecco', 'Cava', 'Sake', 'Soju',
		'IPA', 'Lager', 'Pilsner', 'Stout', 'Porter', 'Wheat Beer', 'Sour Beer', 'Belgian Ale',
		'Whiskey', 'Bourbon', 'Scotch', 'Rye', 'Irish Whiskey', 'Japanese Whiskey', 'Canadian Whiskey', 'Tennessee Whiskey',
		'Vodka', 'Gin', 'Rum', 'Tequila', 'Brandy', 'Cognac', 'Armagnac', 'Calvados',
		'Martini', 'Manhattan', 'Old Fashioned', 'Negroni', 'Moscow Mule', 'Mojito', 'Daiquiri', 'Margarita',
		'Piña Colada', 'Mai Tai', 'Hurricane', 'Zombie', 'Long Island Iced Tea', 'Cosmopolitan', 'Sex on the Beach', 'Tequila Sunrise',
		'Lemonade', 'Iced Tea', 'Arnold Palmer', 'Shirley Temple', 'Roy Rogers', 'Virgin Mojito', 'Virgin Piña Colada', 'Mocktail',
		'Energy Drink', 'Sports Drink', 'Protein Shake', 'Smoothie', 'Milkshake', 'Frappe', 'Slushie', 'Slurpee',
		'Hot Chocolate', 'Hot Toddy', 'Mulled Wine', 'Eggnog', 'Apple Cider', 'Hot Buttered Rum', 'Irish Coffee', 'Spanish Coffee',
		'Kombucha', 'Kefir', 'Kvass', 'Tepache', 'Jun', 'Water Kefir', 'Milk Kefir', 'Coconut Kefir'
	],
	cities: [
		'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
		'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco',
		'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit',
		'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque',
		'Tucson', 'Fresno', 'Sacramento', 'Kansas City', 'Mesa', 'Atlanta', 'Omaha', 'Colorado Springs',
		'Raleigh', 'Virginia Beach', 'Miami', 'Oakland', 'Minneapolis', 'Tulsa', 'Cleveland', 'Wichita',
		'Arlington', 'New Orleans', 'Honolulu', 'London', 'Paris', 'Tokyo', 'Sydney', 'Toronto',
		'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Barcelona', 'Vienna', 'Prague', 'Budapest',
		'Stockholm', 'Copenhagen', 'Oslo', 'Helsinki', 'Dublin', 'Edinburgh', 'Manchester', 'Liverpool',
		'Moscow', 'Saint Petersburg', 'Istanbul', 'Dubai', 'Singapore', 'Hong Kong', 'Bangkok', 'Seoul',
		'Shanghai', 'Beijing', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
		'Cairo', 'Johannesburg', 'Cape Town', 'Nairobi', 'Lagos', 'Accra', 'Casablanca', 'Tunis',
		'Rio de Janeiro', 'São Paulo', 'Buenos Aires', 'Lima', 'Bogotá', 'Santiago', 'Caracas', 'Montevideo',
		'Mexico City', 'Guadalajara', 'Monterrey', 'Cancún', 'Panama City', 'San José', 'Havana', 'Kingston',
		'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Auckland', 'Wellington', 'Christchurch', 'Queenstown'
	],
	programmingLanguages: [
		'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go',
		'Rust', 'Swift', 'Kotlin', 'TypeScript', 'Scala', 'R', 'MATLAB', 'Perl',
		'Lua', 'Haskell', 'Clojure', 'Erlang', 'Elixir', 'F#', 'OCaml', 'Scheme',
		'Lisp', 'Prolog', 'Smalltalk', 'Fortran', 'COBOL', 'Ada', 'Pascal', 'Delphi',
		'Assembly', 'Machine Code', 'C', 'Objective-C', 'D', 'Nim', 'Crystal', 'Zig',
		'V', 'Odin', 'Jai', 'Carbon', 'Mojo', 'Julia', 'Dart', 'Elm',
		'PureScript', 'Reason', 'ReScript', 'Fable', 'BuckleScript', 'LiveScript', 'CoffeeScript', 'Dart',
		'ActionScript', 'Lingo', 'GML', 'GDScript', 'UnrealScript', 'Blueprint', 'HLSL', 'GLSL',
		'Shaders', 'SQL', 'PL/SQL', 'T-SQL', 'NoSQL', 'MongoDB', 'CouchDB', 'Redis',
		'HTML', 'CSS', 'SASS', 'SCSS', 'LESS', 'Stylus', 'PostCSS', 'Tailwind',
		'React', 'Vue', 'Angular', 'Svelte', 'Ember', 'Backbone', 'Meteor', 'Mithril',
		'Node.js', 'Deno', 'Bun', 'Express', 'Nest', 'Fastify', 'Koa', 'Hapi',
		'Django', 'Flask', 'FastAPI', 'Tornado', 'Pyramid', 'Bottle', 'CherryPy', 'Web2py'
	]
};

function getItemsForSize(category: string, size: number): string[] {
	const items = categories[category as keyof typeof categories] || [];
	return items.slice(0, size);
}

export function getPremadeLists(): PremadeList[] {
	const sizes: number[] = [8, 16, 32, 64, 128];
	const categoryNames = Object.keys(categories);
	const lists: PremadeList[] = [];

	for (const category of categoryNames) {
		for (const size of sizes) {
			lists.push({
				category,
				size,
				items: getItemsForSize(category, size)
			});
		}
	}

	return lists;
}

export function getCategories(): string[] {
	return Object.keys(categories);
}

export function getListByCategoryAndSize(category: string, size: number): string[] {
	return getItemsForSize(category, size);
}

