window.ENDING_TEST_DATA = {
  "traits": [
    "drive",
    "means",
    "know",
    "kin",
    "care",
    "risk",
    "control"
  ],
  "forks": [
    {
      "id": "science",
      "question": "Companies are offering your postdocs three times their pay.",
      "options": [
        {
          "id": "sciacad",
          "label": "Let them go, wish them luck",
          "description": "They take what they learned with you to other companies. The ones who stay ask the big questions, and once in a while one finds something nobody was looking for.",
          "traits": {
            "care": 0.5,
            "control": -0.5,
            "drive": -0.3
          },
          "heart": 0,
          "endingLine": "A lot of good scientists stayed at the university because you paid them to."
        },
        {
          "id": "sciind",
          "label": "Hire them into your company",
          "description": "Applied work, and fast. Kit materials 5% cheaper right away. Fewer people stay to ask the big questions.",
          "traits": {
            "drive": 1,
            "control": 0.5
          },
          "heart": 0,
          "endingLine": "Your company has its own scientists, they work on what sells."
        }
      ]
    },
    {
      "id": "labname",
      "question": "The university wants to name the new marine lab after someone.",
      "options": [
        {
          "id": "labgrandpa",
          "label": "Name it after Grandma",
          "description": "She says she doesn’t care, then visits every Sunday. The university warns her name may bring fewer donors.",
          "traits": {
            "drive": -1
          },
          "heart": 1,
          "endingLine": "Grandma’s name on a marine lab."
        },
        {
          "id": "labyou",
          "label": "Name it after you",
          "description": "Donors recognize your name and back the lab. More influence ✦ every day than any other naming deal.",
          "traits": {
            "drive": 1
          },
          "heart": -1,
          "endingLine": "Your name on a university."
        }
      ]
    },
    {
      "id": "study",
      "question": "A university wants to run a big study on shrimp and stress.",
      "options": [
        {
          "id": "studyopen",
          "label": "Fund it, publish whatever they find",
          "description": "A year to wait. It might find nothing, then you’ve paid for nothing.",
          "traits": {
            "means": 0.3,
            "drive": -0.3
          },
          "heart": 2,
          "endingLine": "An honest study on shrimp and stress."
        },
        {
          "id": "studybuy",
          "label": "Skip the study, survey your own owners",
          "description": "Out next month. Nine in ten say they feel calmer. Scientists ignore it, customers don’t.",
          "traits": {
            "means": -0.3
          },
          "heart": -1,
          "endingLine": "A survey of your own owners. Nine in ten felt calmer."
        }
      ]
    },
    {
      "id": "gene",
      "question": "Your lab found the gene behind the cherry red.",
      "options": [
        {
          "id": "geneshare",
          "label": "Share it",
          "description": "Every breeder gets better shrimp, your rivals too. Word of mouth up a little.",
          "traits": {
            "care": 0.7,
            "drive": -0.3
          },
          "heart": 2,
          "endingLine": "Red shrimp in every breeder’s tank, for free."
        },
        {
          "id": "genepatent",
          "label": "License the line",
          "description": "You can’t own the gene, you can own the line you bred. Breeders pay to use it, money every day for more research.",
          "traits": {
            "drive": 0.7
          },
          "heart": -2,
          "endingLine": "Every red shrimp on Earth pays you."
        }
      ]
    },
    {
      "id": "paper",
      "question": "The Shrimp Times makes fun of you every week.",
      "options": [
        {
          "id": "paperfree",
          "label": "Give the editor an interview",
          "description": "She asks hard questions and the jokes keep coming. People like you more for answering.",
          "traits": {
            "control": -0.5
          },
          "heart": 1,
          "endingLine": "A newspaper that still makes fun of you."
        },
        {
          "id": "paperbuy",
          "label": "Buy The Shrimp Times",
          "description": "Its jokes scare off new buyers right when you need them. Owned, it stays on your side.",
          "traits": {
            "control": 0.5,
            "drive": 0.5
          },
          "heart": -2,
          "endingLine": "A newsletter that only says nice things about you."
        }
      ]
    },
    {
      "id": "welfare",
      "question": "Lawmakers want a pet welfare law, it would cover shrimp too.",
      "options": [
        {
          "id": "lawback",
          "label": "Back the law",
          "description": "More paperwork, kits cost 5% more. More of them live.",
          "traits": {
            "kin": 0.5,
            "means": 0.5,
            "control": -0.5
          },
          "heart": 2,
          "endingLine": "A pet welfare law that covers shrimp."
        },
        {
          "id": "lawbribe",
          "label": "Run your own audits instead",
          "description": "Your farms already pass. You publish your numbers and lobby to be exempt. Upkeep 15% lower. Smaller farms get the exemption too, and some of them don’t pass.",
          "traits": {
            "control": 0.5,
            "means": -0.5,
            "kin": -0.5
          },
          "heart": -2,
          "endingLine": "Farms that check themselves."
        }
      ]
    },
    {
      "id": "fish",
      "question": "Fishing towns lose work as more people keep shrimp as pets. The crews need new jobs.",
      "options": [
        {
          "id": "retrain",
          "label": "Retraining fund",
          "description": "Crews learn kelp farming and reef tours. Slow and expensive, the towns forgive you.",
          "traits": {
            "care": -0.5,
            "drive": -0.3
          },
          "heart": 2,
          "endingLine": "Old fishing crews running reef tours."
        },
        {
          "id": "harbors",
          "label": "Lease the empty docks",
          "description": "The towns need the rent. Ocean ranches 45% cheaper, and the old fishing ports smell of shrimp feed now.",
          "traits": {
            "drive": 0.7
          },
          "heart": -2,
          "endingLine": "Old fishing docks turned into shrimp farms."
        }
      ]
    },
    {
      "id": "breeder",
      "question": "A small breeder down the road sells kits too.",
      "options": [
        {
          "id": "coop",
          "label": "Start a co-op with her",
          "description": "She knows a lot about shrimp, you share orders with her. Kit survival up a little.",
          "traits": {
            "care": -0.5,
            "control": -0.5,
            "drive": -0.3
          },
          "heart": 2,
          "endingLine": "A breeder co-op that started with your neighbour."
        },
        {
          "id": "buyout",
          "label": "Buy her out",
          "description": "Her kits die a lot, and every dead kit puts a family off shrimp. One seller, one standard, more orders come to you.",
          "traits": {
            "drive": 1,
            "control": 0.5
          },
          "heart": -2,
          "endingLine": "A closed shop down the road."
        }
      ]
    },
    {
      "id": "ship",
      "question": "Some shrimp die in the mail.",
      "options": [
        {
          "id": "shipwarm",
          "label": "Insulated boxes and heat packs",
          "description": "AED 4 more on every kit, more shrimp arrive alive.",
          "traits": {
            "kin": 1,
            "know": 0.3,
            "means": 0.3
          },
          "heart": 1
        },
        {
          "id": "shipcheap",
          "label": "Ship cheap, replace the losses",
          "description": "Only a few boxes lose shrimp. Replacing those costs less than heat packs on every box. AED 4.50 less a kit.",
          "traits": {
            "kin": -1,
            "means": -0.3,
            "know": -0.3
          },
          "heart": -2
        }
      ]
    },
    {
      "id": "culls",
      "question": "Low-grade shrimp pile up at the farms.",
      "options": [
        {
          "id": "cullschool",
          "label": "Give them to schools",
          "description": "Healthy, just not red enough to sell. Teachers set up class tanks. You lose some sales, but you gain a little influence ✦ every day.",
          "traits": {
            "kin": 1,
            "means": 0.3
          },
          "heart": 1,
          "endingLine": "Class tanks full of healthy young shrimp."
        },
        {
          "id": "cullfeed",
          "label": "Sell them as live fish food",
          "description": "That’s where most low-grade shrimp end up anyway. Pet stores pay by the bag, money every day.",
          "traits": {
            "kin": -2
          },
          "heart": -2,
          "endingLine": "Bags of live fish food with your logo."
        }
      ]
    },
    {
      "id": "filter",
      "question": "The kit filter could be built better.",
      "options": [
        {
          "id": "filterlast",
          "label": "A sponge filter that lasts for years",
          "description": "Costs more to build, a rinse now and then, owners never buy another. Kit survival up a little.",
          "traits": {
            "care": -0.3,
            "drive": -0.3,
            "means": 0.3
          },
          "heart": 1
        },
        {
          "id": "filtercart",
          "label": "Monthly cartridges",
          "description": "Money every day. Each swap throws away the bacteria living in the old one, and some tanks crash after a change.",
          "traits": {
            "kin": -0.3
          },
          "heart": -2,
          "endingLine": "A monthly filter cartridge in every home."
        }
      ]
    },
    {
      "id": "food",
      "question": "Owners keep asking what to feed.",
      "options": [
        {
          "id": "foodopen",
          "label": "Publish a simple recipe",
          "description": "Blanched spinach, pollen, a pinch of algae. Some owners will overfeed. Word of mouth up a little.",
          "traits": {
            "kin": 0.5
          },
          "heart": 1
        },
        {
          "id": "foodpods",
          "label": "Sell measured food pods",
          "description": "Overfeeding kills more shrimp than anything, a pod is the right amount. Only your pods fit, money every day.",
          "traits": {
            "kin": -0.3
          },
          "heart": -1,
          "endingLine": "Your food pods in every kitchen."
        }
      ]
    },
    {
      "id": "careplan",
      "question": "Owners want someone to call when a tank looks wrong.",
      "options": [
        {
          "id": "careplanfree",
          "label": "Free care plan for every owner",
          "description": "Every living tank gets a check-in call each month. It costs you AED 0.50 a tank a month, for as long as they keep it. More tanks thrive.",
          "traits": {
            "kin": 0.4,
            "know": -0.4
          },
          "heart": 2,
          "endingLine": "Every owner gets a call when the tank looks off. Nobody pays for it."
        },
        {
          "id": "careplanpaid",
          "label": "Sell a monthly care plan",
          "description": "The calls cost money, the fee pays for them and then some. You set the fee in Owners’ tanks, more people sign up when it’s cheap and people like you.",
          "traits": {
            "kin": -0.4,
            "know": 0.4
          },
          "heart": -1,
          "endingLine": "Your care plan is a line on a billion bank statements."
        }
      ]
    },
    {
      "id": "layoff",
      "question": "The robots can do the packers’ jobs now.",
      "options": [
        {
          "id": "retrainpack",
          "label": "Retrain them as farm techs",
          "description": "Everyone keeps a job. You pay for training and wages you don’t strictly need.",
          "traits": {
            "means": 1,
            "care": -0.3
          },
          "heart": 2,
          "endingLine": "Old packers running the night shift at the farms."
        },
        {
          "id": "layoffpack",
          "label": "Let them go",
          "description": "The robots do the work now. Two weeks’ pay each, the rest goes into more kits.",
          "traits": {
            "means": -0.5,
            "care": 0.2
          },
          "heart": -2
        }
      ]
    },
    {
      "id": "reviews",
      "question": "Your shop page only has a few reviews.",
      "options": [
        {
          "id": "revreal",
          "label": "Ask happy owners for photos",
          "description": "Slow, most people never post. The ones who do are real. Word of mouth up a little.",
          "traits": {
            "drive": -0.5,
            "risk": -0.3,
            "means": 0.3
          },
          "heart": 1
        },
        {
          "id": "revfake",
          "label": "Give a bag of food for every review",
          "description": "5,000 reviews in a month, all from real owners, mostly five stars. The marketplace labels them incentivised. Word of mouth up a lot.",
          "traits": {
            "drive": 0.5,
            "means": -0.5
          },
          "heart": -1
        }
      ]
    },
    {
      "id": "kids",
      "question": "A children’s TV channel wants your ads. The same money would buy kits for schools.",
      "options": [
        {
          "id": "kidsads",
          "label": "Ads between cartoons",
          "description": "Kids are the ones who keep a tank going for years, and they ask until the parents give in. +4.5% want one.",
          "traits": {
            "drive": 1
          },
          "heart": -2,
          "endingLine": "Kids who learned the shrimp jingle before their ABCs."
        },
        {
          "id": "kidsfree",
          "label": "Kits for poor schools, no ads to kids",
          "description": "AED 600,000 for class tanks that sell nothing. Slower, +2% want one.",
          "traits": {
            "care": 0.7,
            "drive": -0.3
          },
          "heart": 2,
          "endingLine": "Class tanks in schools that couldn’t afford them."
        }
      ]
    },
    {
      "id": "data",
      "question": "An ad company wants to buy your owner data.",
      "options": [
        {
          "id": "datasell",
          "label": "Sell it",
          "description": "No names, and the terms already allow it. AED 7.5M now, and better-aimed ads.",
          "traits": {
            "drive": 0.5,
            "means": -0.5
          },
          "heart": -2,
          "endingLine": "Owners who get ads for shrimp food before they know they need it."
        },
        {
          "id": "datakeep",
          "label": "Keep it private",
          "description": "No money. Owners never find out either way.",
          "traits": {
            "care": -0.3,
            "drive": -0.2,
            "means": 0.3
          },
          "heart": 1
        }
      ]
    },
    {
      "id": "waste",
      "question": "Cleaning the water from your farms costs a lot.",
      "options": [
        {
          "id": "wasteclean",
          "label": "Keep cleaning it, add plant filters",
          "description": "AED 1.5M, the river below the farm stays clear.",
          "traits": {
            "kin": 0.5,
            "means": 0.3
          },
          "heart": 2,
          "endingLine": "A clear river below every farm."
        },
        {
          "id": "wastedump",
          "label": "Stop cleaning it",
          "description": "It’s mostly nitrate, which is fertiliser, and the river is big. Farm upkeep 22% lower. Big farms can still tip a river.",
          "traits": {
            "kin": -1
          },
          "heart": -3,
          "endingLine": "A green river below the old farm."
        }
      ]
    },
    {
      "id": "land",
      "question": "The next mega hatchery needs a lot of land.",
      "options": [
        {
          "id": "landfarm",
          "label": "Use old farmland",
          "description": "Land that could grow food. Mega hatcheries cost 30% more.",
          "traits": {
            "kin": 0.5,
            "means": 0.5
          },
          "heart": 1
        },
        {
          "id": "landwet",
          "label": "Drain a wetland",
          "description": "Cheap, flat, already wet, nobody farms it. Mega hatcheries cost 38% less. Birds stop there on the way south.",
          "traits": {
            "kin": -1.5
          },
          "heart": -3,
          "endingLine": "A filled wetland, and birds that don’t stop anymore."
        }
      ]
    }
  ],
  "cards": [
    {
      "id": "c_cash",
      "title": "The hatchery bust",
      "body": "Pelagonia lent money to anyone who wanted to start a shrimp hatchery. Most of them failed. The bank wants to sell you the good ones cheap, the taxpayers cover the rest.",
      "options": [
        {
          "label": "Buy the good ones",
          "description": "Most of the workers keep their jobs. The taxpayers still pay for the ones that failed.",
          "traits": {
            "means": -0.5,
            "drive": 0.7,
            "care": -0.3
          },
          "endingLine": "You bought Pelagonia’s best hatcheries and kept most of the crews."
        },
        {
          "label": "Let the bank sell them off",
          "description": "Some workers lose their jobs. No public money goes into a failed boom.",
          "traits": {
            "means": 0.5,
            "drive": -0.5
          },
          "endingLine": "Pelagonia’s bank sold the failed hatcheries for parts."
        }
      ]
    },
    {
      "id": "c_power",
      "title": "The electricity bill",
      "body": "Five billion tanks with a pump, a light and sometimes a heater use about 1% of the world’s electricity, dozens of power stations’ worth.",
      "options": [
        {
          "label": "Low-power kits, AED 7.50 more a kit",
          "description": "LED on a timer, a 1-watt pump, a heater only where it gets cold.",
          "traits": {
            "care": 1,
            "means": 0.5
          },
          "endingLine": "Every new kit has a light on a timer and a pump that uses a watt."
        },
        {
          "label": "Fund the engineers, AED 50M",
          "description": "A pump that uses less than a phone charger.",
          "traits": {
            "know": 0.3,
            "risk": 0.3
          },
          "endingLine": "Shrimp pumps use less power than a phone charger now."
        },
        {
          "label": "Leave it to the power companies",
          "description": "Kits stay cheap. They build more plants, mostly gas.",
          "traits": {
            "care": -0.5,
            "know": -0.3
          },
          "endingLine": "Power companies built more plants for shrimp tanks, mostly gas."
        }
      ]
    },
    {
      "id": "c_rivers",
      "title": "Shrimp in the rivers",
      "body": "Some owners dump their shrimp when they get bored. Red shrimp breed in a few warm rivers now, one in Germany runs below a power plant.",
      "options": [
        {
          "label": "Shops take them back, AED 50M",
          "description": "Any shop that sells your kits takes unwanted shrimp back, no questions asked.",
          "traits": {
            "kin": 0.5,
            "care": -0.3
          },
          "endingLine": "Unwanted shrimp go back to the shop, not the river."
        },
        {
          "label": "Pay river teams, AED 20M",
          "description": "They catch a lot of them, never all.",
          "traits": {
            "kin": 0.5,
            "care": 0.5
          },
          "endingLine": "River teams catch the red shrimp they can find."
        },
        {
          "label": "Leave it to the river agencies",
          "description": "Your money stays in kits. The agencies catch some, and red shrimp spread to warm rivers on four continents.",
          "traits": {
            "control": -0.5,
            "care": -0.3,
            "kin": -0.5
          },
          "endingLine": "Red shrimp live in warm rivers on four continents."
        }
      ]
    },
    {
      "id": "c_many",
      "title": "Too many shrimp",
      "body": "Every tank breeds. Owners have hundreds and give them to friends, so fewer people buy kits.",
      "options": [
        {
          "label": "Buy spares back for new kits",
          "description": "Shops pay owners a little per shrimp, you pack them into kits.",
          "traits": {
            "kin": 1
          }
        },
        {
          "label": "Sell them on as fish food",
          "description": "Somebody has to.",
          "traits": {
            "kin": -2,
            "drive": 0.3
          },
          "endingLine": "Spare pet shrimp end up as fish food."
        },
        {
          "label": "Let the price fall",
          "description": "Cheap shrimp everywhere. Kits sell as a starter tank, not for the shrimp.",
          "traits": {
            "kin": -0.5,
            "drive": -0.3
          },
          "endingLine": "A shrimp costs nothing now, people give them away at weddings."
        }
      ]
    },
    {
      "id": "c_blackout",
      "title": "Blackout",
      "body": "A summer blackout, two days, no air conditioning. Rooms reach 38 °C. Cherry shrimp start dying above 30.",
      "options": [
        {
          "label": "Battery pumps and a cooling guide, AED 30M",
          "description": "Every owner in the city gets a battery air pump and the frozen-bottle trick.",
          "traits": {
            "care": -0.5,
            "risk": -1,
            "control": -0.3
          },
          "endingLine": "Owners in hot cities keep a battery pump and a frozen bottle for the next blackout."
        },
        {
          "label": "Free replacements, AED 45M",
          "description": "New shrimp for everyone who lost theirs. Kits can now come with a battery pump.",
          "traits": {
            "means": 1,
            "kin": 0.5
          },
          "endingLine": "Everyone who lost shrimp in the blackout got new ones, and kits can come with a battery pump."
        },
        {
          "label": "A 24-hour help line",
          "description": "Move the tank to the floor, float a frozen bottle, skip feeding.",
          "traits": {
            "control": 0.5
          },
          "endingLine": "A help line talked owners through the next blackout."
        }
      ]
    },
    {
      "id": "c_prison",
      "title": "Tiny jails",
      "body": "A shrimp liberation group says every tank is a tiny jail. They’re not all wrong, a 20 L tank is small.",
      "options": [
        {
          "label": "Argue with them",
          "description": "You go on TV with a planted tank. It goes fine.",
          "traits": {
            "kin": -1,
            "control": 0.3
          }
        },
        {
          "label": "Fund a wild reserve, AED 20M",
          "description": "A valley where shrimp live free.",
          "traits": {
            "kin": 1
          },
          "endingLine": "There’s a valley where shrimp live with no glass around them."
        },
        {
          "label": "Agree with them",
          "description": "Grandma says the shrimp might want to see what’s out there.",
          "traits": {
            "kin": 0.5,
            "drive": -0.3
          },
          "endingLine": "You agreed that tanks are tiny jails, and started thinking about where else shrimp could live."
        }
      ]
    },
    {
      "id": "c_fisher",
      "title": "The fishing family",
      "body": "Mira’s other grandpa fished shrimp for a living. People who keep shrimp stopped eating them, the price fell, and he sold his boat. Mira asks if you knew.",
      "options": [
        {
          "label": "Offer him work at the hatchery",
          "description": "Steady pay. He’s still raising shrimp, just not catching them.",
          "traits": {
            "means": 1,
            "care": -0.5
          },
          "endingLine": "Mira’s other grandpa works at your hatchery. He still calls them prawns."
        },
        {
          "label": "Help him start reef tours, AED 300,000",
          "description": "A small boat, visitors, the same coast. He’s back on the water.",
          "traits": {
            "means": 1,
            "care": -0.5
          },
          "endingLine": "Mira’s other grandpa takes visitors out to the reef."
        },
        {
          "label": "Visit him with Mira",
          "description": "No offer, just an afternoon on the dock. He shows you how he mended nets.",
          "traits": {
            "care": -1,
            "drive": -0.5
          },
          "endingLine": "You spent an afternoon on the dock with Mira’s other grandpa. He showed you how he mended nets."
        }
      ]
    },
    {
      "id": "c_mytank",
      "title": "Your own tank",
      "body": "Grandma’s old tank, the one you kept, is green and quiet. A few shrimp may still be hiding in the moss.",
      "options": [
        {
          "label": "Start it again",
          "description": "You clean the glass and restock it from the farm.",
          "traits": {
            "kin": 1
          },
          "endingLine": "You kept your first tank going, mostly."
        },
        {
          "label": "Leave it a while",
          "description": "It stays on the shelf, green. It is still yours.",
          "traits": {
            "kin": -0.5,
            "drive": -0.5,
            "control": -0.5
          },
          "endingLine": "The first tank went green around year eight and stayed that way for a long time."
        }
      ]
    }
  ],
  "endingTypes": {
    "empire_good": {
      "id": "empire_good",
      "end": "empire",
      "name": "The Empire, the good emperor",
      "who": "You wanted to be the best, and you were. You built the biggest shrimp company in history and you mostly played fair. People respected you, a lot of them liked you, a few were scared of how much you owned. You still answer emails on Sundays.",
      "mira": "Your head of operations. She runs the company better than you do and you both know it.",
      "gp": "They put you on the cover of a magazine at the airport. I bought three. You did everything you said you would, and you did it decently, people tell me that when they find out I'm your grandmother. [visit] One thing, take a day off. Come fishing.",
      "tank": "Everything was good. The water was good, the food was good, there was a lot of us and we were all fine. Every tank was the same tank."
    },
    "empire_dictator": {
      "id": "empire_dictator",
      "end": "empire",
      "name": "The Empire, the dictator",
      "who": "You wanted it done, and you got it done faster than anyone thought possible. You bought what you couldn't build, you said what needed saying, and the people in the way didn't keep you up at night. Most rules turned out to be someone who hadn't been paid yet.",
      "mira": "She started her own company. It does things the slow way and it does fine. She doesn't call.",
      "gp": "I saw your statue on the news. It doesn't look like you, it looks taller. You did it, every home has a tank, faster than I ever thought. I keep a little jar in the bedroom. It's the only tank in the building without your logo on it. [visit]",
      "tank": "The water was always perfect. The machine fed us, the machine cleaned us, the machine counted us. We were counted many times a day. Nobody came close to the glass.",
      "last": "Everyone has a tank, most of them have your name on it, and nobody says no to you anymore."
    },
    "empire_cartel": {
      "id": "empire_cartel",
      "end": "empire",
      "name": "The Empire, the cartel",
      "who": "You took the money when it was offered and you never gave it back. You gave them the routes, then the trucks, and somewhere along the way it stopped being a shrimp company that did favours and became something else with shrimp on top.",
      "mira": "She's a journalist now. She wrote the story about you. It won a prize, and nothing happened to you, and she knew that would be how it went.",
      "gp": "Mira came to see me, she showed me what she wrote. I told her I didn't want to read it and then I read it twice. I don't know what to say to you so I'll say what I always say, the tank's still running. [visit] Come for dinner, I'll leave the door unlocked.",
      "tank": "We were moved at night a lot. There were other boxes next to ours, heavy ones. People who carried us didn't look at us. Once a tank fell and nobody picked us up."
    },
    "garden_village": {
      "id": "garden_village",
      "end": "garden",
      "name": "The Garden, the village",
      "who": "You never moved far. You built one thing well and you let it take the time it took. You knew the names of the people who packed your kits. When it was faster or better, you usually picked better and lost some money. You thought shrimp were worth looking after properly, all of them, even the pale ones nobody wanted.",
      "mira": "She studied the sea. She lives on the coast two hours away and still sends photos of the mangroves.",
      "gp": "I sit in the garden most mornings now. The shrimp room is warmer than my old flat, don't tell the shrimp club. You took longer than you had to, everyone said so. I think you knew that and didn't mind. [visit] I'm proud of you, I don't say it enough, so I'm writing it down.",
      "tank": "There was a lot of green. Food came at the same time every day. Sometimes a big face came close to the glass and stayed a long time. We didn't know what it wanted. It never took anyone away."
    },
    "garden_hermit": {
      "id": "garden_hermit",
      "end": "garden",
      "name": "The Garden, the hermit",
      "who": "At some point you stopped going to the meetings. You built the house, you built the shrimp room, you put a sign on the gate. The company kept going without you and you were fine with that. You talk to the shrimp more than to people.",
      "mira": "She visits once a year and fixes your solar panels. She says you're impossible. She keeps coming.",
      "gp": "You're the only person I know who got everything they wanted and then went to live in a field. Now the shrimp club wants a well, thanks a lot. [visit] Call me sometimes, the shrimp can't tell you what's going on in the world.",
      "tank": "It was very quiet. The light came from the sun, not from a lamp. Someone sat with us every evening and did nothing. We liked it."
    },
    "question_prof": {
      "id": "question_prof",
      "end": "question",
      "name": "The Question, the professor",
      "who": "Somewhere around the first research grant the shrimp stopped being a business and became a question. Why do they molt when they do. How a jar of water stays alive for years. Whether another planet could hold them. You didn't get rich. You trained a lot of people who went further than you did.",
      "mira": "A marine biologist. She was one of your first scholarship students. She calls you her old professor even though you never taught her a class.",
      "gp": "I don't understand half of what you write to me now. I read it anyway, out loud, to the shrimp. You were always like this, you took the radio apart when you were six. [visit] Find out what the water is like out there, then come tell me.",
      "tank": "People watched us very carefully. They wrote things down. Some of us went up, very far, in a small dark box, and then there was a lake with no one in it, and then there was a lake with us in it."
    },
    "question_lucky": {
      "id": "question_lucky",
      "end": "question",
      "name": "The Question, the lucky one",
      "who": "You funded people for years for no good reason. Nobody could tell you what the research was for and you paid anyway. Most of it went nowhere. One of them found the gene for heat tolerance, and that's why there are shrimp on a hot world now. You never claimed it, you just kept paying.",
      "mira": "She runs the lab that found it. She sends you the papers with your name crossed out of the thank-yous, because you asked her to.",
      "gp": "People keep asking me what you do and I say I don't know, something with science. They think I'm being modest for you. I'm not, I really don't know. [visit] The shrimp club says it's something with shrimp and the weather. That's what I tell people now.",
      "tank": "For a long time nothing happened and people kept watching. Then one day the water was warm, very warm, and we were fine."
    },
    "network_life": {
      "id": "network_life",
      "end": "network",
      "name": "The Network, the lifeline",
      "who": "You went everywhere and talked to everyone. Somewhere in the middle you noticed that a network that keeps live shrimp alive across the world can keep other things alive too. You put water filters on the trucks, then vaccines, then insulin. Half your company doesn't touch shrimp anymore. You spent most of your life in airports and you know someone in every city.",
      "mira": "She runs the water routes. She's the reason they reach the desert towns.",
      "gp": "You sent me a postcard from a place I can't pronounce, the stamp had one of your trucks on it. I keep them all in the shrimp book. [visit] I say fewer postcards, more visits.",
      "tank": "We went a very long way. It was cold and dark and loud, and then it was quiet and someone very small put their nose on the glass and didn't move for an hour."
    },
    "network_dark": {
      "id": "network_dark",
      "end": "network",
      "name": "The Network, the dark network",
      "who": "You went everywhere and talked to everyone, including people you shouldn't have. They needed routes, you had the best routes in the world. You told yourself the medicine still got through, and it did, next to the other boxes. You did a lot of good and a lot of the other thing, on the same trucks.",
      "mira": "She quit the year she found out what was in the other boxes. She runs a water charity now, it uses someone else's trucks.",
      "gp": "People tell me about you on the news and I don't know which story to believe, so I believe all of them a little. [visit] You can still stop. I'm old, I'm allowed to say that.",
      "tank": "We travelled all the time. Next to us there were always other boxes. Some went to hospitals. Some went to places where people were afraid."
    },
    "network_back": {
      "id": "network_back",
      "end": "network",
      "name": "The Network, the one who turned back",
      "who": "You went everywhere, you talked to everyone, and for a few years you said yes to people you shouldn't have. Then one night you went to the police. It cost you almost everything and a year of nothing. You rebuilt from the same trucks, and you made them carry the right things this time.",
      "mira": "She helped you through that year and didn't take any money. She runs your water routes now.",
      "gp": "I've been to forty countries since, and in every one of them somebody knew your trucks. Not the shrimp, the trucks, they said the water came on them. I know about the bad years, Mira told me. I won't say anything about it, you already know. What you did after is the part I tell people about. [visit]",
      "tank": "We travelled a lot, always cold and always on time. Next to us there were boxes of other things, medicine sometimes, and for a long time things that weren't medicine. Then the boxes changed again."
    },
    "drift_shop": {
      "id": "drift_shop",
      "end": "drift",
      "name": "The Drift, the happy shop",
      "who": "You had one shop and it was enough. Some years you meant to open a second one and then it was summer. You let the big things happen around you, other people built the farms and the networks, and you sold shrimp to the same forty families for twenty years. You knew which kid named which shrimp.",
      "mira": "She paints shrimp. Nobody buys the paintings. Three of them hang in your shop and you won't sell them either.",
      "gp": "Everyone keeps asking me if I'm disappointed you didn't do the big thing. I tell them I sit in your shop on Sundays and drink tea and look at the shrimp, why would I be disappointed. [visit]",
      "tank": "Nothing much happened, for a long time, in a good way. The cat watched us. We watched the cat."
    },
    "drift_famous": {
      "id": "drift_famous",
      "end": "drift",
      "name": "The Drift, accidentally famous",
      "who": "You never tried very hard and somehow it kept working. A video of your tank went around the world when you weren't looking. People started copying what you did without you telling them anything. You're on a stamp in four countries. You still don't really know why.",
      "mira": "She manages your accounts because you never open them. She says you're the luckiest person alive and she's probably right.",
      "gp": "A man at the shrimp club asked me to sign his book because I'm your grandmother. I signed it Grandma. [visit] Don't let it go to your head, it hasn't so far, that's the good part.",
      "tank": "Lights flashed at us a lot. People pressed their phones against the glass. We didn't mind, there was always enough food."
    },
    "fall_fast": {
      "id": "fall_fast",
      "end": "fall",
      "name": "The fall, too far too fast",
      "who": "You bought the next farm before the last one paid for itself, every time. It worked until it didn't. The bank took the hatcheries in the spring and the shops in the summer. You were three months from turning it around, or you were never going to, you'll think about that for a while.",
      "mira": "She came to the auction and bought one tank, the first one you ever sold her family.",
      "next": "Someone bought your farms cheap and finished the job. Everyone has a tank eleven years after you stopped.",
      "gp": "I've lost a boat once, it's not the end. You tried too hard, that's all. [visit] Your first tank is still on your shelf. Start again if you want.",
      "tank": "One day the lights didn't come on. Then new people came, and the lights came back on, different lights."
    },
    "fall_shark": {
      "id": "fall_shark",
      "end": "fall",
      "name": "The fall, the loan shark",
      "who": "It was supposed to be one loan, for one bad month. Then it was the interest on the loan, then a loan for the interest. They smashed the first farm in October. You went to the police, then you declared bankruptcy.",
      "mira": "She doesn't know the whole story. Her mom told her not to ask.",
      "next": "Your trucks belong to someone else now. Nobody's sure who. Everyone has a tank eventually, the trucks never stop at borders.",
      "gp": "Why didn't you ask me, I would have given you all of it. I know why. I'd have done the same at your age. [visit] Come home for a bit. Nobody needs to know where you are.",
      "tank": "The people who fed us changed and they didn't look at us. Then there were no people for a long time."
    },
    "fall_stop": {
      "id": "fall_stop",
      "end": "fall",
      "name": "The fall, it just stopped",
      "who": "You stopped checking the numbers, then you stopped checking the tanks. Nobody did anything wrong, it all just ran down. The bank letter sat on the kitchen table for a month before you opened it.",
      "mira": "She took the shrimp home. All of them, in buckets, on a bus.",
      "next": "Other people sold kits. Everyone has a tank sixteen years after you stopped, and nobody remembers who started it.",
      "gp": "The bank called here too. I told them you moved to Oman. [visit] Come over on Saturday, I'll make the fish soup, don't tell the shrimp.",
      "tank": "It got green. It got quiet. A small girl came with buckets and took us somewhere with a window."
    },
    "sold": {
      "id": "sold",
      "end": "sold",
      "name": "Sold",
      "who": "Someone offered you more money than you could spend and you took it. Maybe you were tired, maybe you'd done what you wanted, maybe the number was just too big. You signed in an office with no shrimp in it.",
      "mira": "She works for the company that bought you. She says it's fine, mostly.",
      "next": "They finished the job their way, faster in some places, worse in others. Everyone has a tank seven years after you sold. Your name isn't on any of them.",
      "gp": "So now you're rich and you're bored, I can tell from your letters. [visit] Buy a small tank, a 20 L, start again for fun. That's how it started last time.",
      "tank": "The logo on the box changed. Nothing else did."
    },
    "stream_world": {
      "id": "stream_world",
      "end": "stream",
      "name": "The Stream",
      "who": "You set out to put a tank in every home and somewhere along the way you stopped counting tanks. You cleaned the farm water, you planted the mangroves, you put native shrimp back in streams where they used to live.",
      "mira": "She runs the river surveys. She sends you a photo every Friday, a different stream each time, always with shrimp in it.",
      "gp": "I walked down to the stream behind the school today. Kids with nets, catching shrimp and letting them go. Nobody had to sell them anything. [visit] That's all I wanted, for people to stop and look.",
      "tank": "One day the glass wasn't there anymore. There was cold water and stones and a lot of others like us, and a child's face very close, looking."
    }
  }
};
