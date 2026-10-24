window.ENDING_TEST_DATA = {
  "traits": [
    "drive",
    "ego",
    "means",
    "know",
    "kin",
    "reach",
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
          "label": "Pay them more to stay",
          "description": "Research doesn’t go faster. More of them stay at the university to ask the big questions, and once in a while one finds something nobody was looking for.",
          "traits": {
            "know": 2,
            "care": 0.5
          },
          "heart": 0,
          "endingLine": "A lot of good scientists stayed at the university because you paid them to."
        },
        {
          "id": "sciind",
          "label": "Hire them into your company",
          "description": "Applied work, and fast. Kit materials 5% cheaper right away. Fewer people stay to ask the big questions.",
          "traits": {
            "know": -2,
            "drive": 1
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
          "description": "She says she doesn’t care, then visits every Sunday. Donors don’t know who she is.",
          "traits": {
            "ego": -1,
            "care": -0.5
          },
          "heart": 1,
          "endingLine": "Grandma’s name on a marine lab."
        },
        {
          "id": "labyou",
          "label": "Name it after you",
          "description": "A known name brings donors and partners. ✦ every day.",
          "traits": {
            "ego": 2
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
          "description": "A year to wait, and it might find nothing.",
          "traits": {
            "know": 1.5
          },
          "heart": 2,
          "endingLine": "An honest study on shrimp and stress."
        },
        {
          "id": "studybuy",
          "label": "Fund it, and tell them what you need",
          "description": "You already know watching shrimp calms people, this just says it sooner. Out next month. Scientists who agree in advance are expensive, three times the price. Looks bad if anyone checks.",
          "traits": {
            "know": -1,
            "ego": 0.5
          },
          "heart": -3,
          "endingLine": "A study that says what you paid for."
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
            "know": 1,
            "care": 1
          },
          "heart": 2,
          "endingLine": "Red shrimp in every breeder’s tank, for free."
        },
        {
          "id": "genepatent",
          "label": "Patent it",
          "description": "If you don’t, someone else will. Royalties every day pay for more research.",
          "traits": {
            "know": -0.5,
            "drive": 1
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
            "control": 1
          },
          "heart": 1,
          "endingLine": "A newspaper that still makes fun of you."
        },
        {
          "id": "paperbuy",
          "label": "Buy The Shrimp Times",
          "description": "Its jokes scare off new buyers right when you need them. Owned, it stays on your side.",
          "traits": {
            "control": -2,
            "ego": 1
          },
          "heart": -2,
          "endingLine": "A newspaper that only says nice things about you."
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
            "kin": 1
          },
          "heart": 2,
          "endingLine": "A pet welfare law that covers shrimp."
        },
        {
          "id": "lawbribe",
          "label": "Pay the inspector to wave your farms through",
          "description": "Your farms already pass, but every inspection shuts one for weeks. Upkeep 10% lower. Illegal, if it comes out.",
          "traits": {
            "risk": 1
          },
          "heart": -3,
          "endingLine": "Farms nobody inspects."
        }
      ]
    },
    {
      "id": "fish",
      "question": "Shrimp boats sit in every harbor, the crews have no work.",
      "options": [
        {
          "id": "retrain",
          "label": "Retraining fund",
          "description": "Crews learn kelp farming and reef tours. Slow and expensive, the towns forgive you.",
          "traits": {
            "care": 1
          },
          "heart": 2,
          "endingLine": "Old fishing crews running reef tours."
        },
        {
          "id": "harbors",
          "label": "Buy their harbors",
          "description": "The towns are broke and nobody else is buying. Ocean ranches 30% cheaper. Some people will call it a takeover.",
          "traits": {
            "drive": 1
          },
          "heart": -2,
          "endingLine": "Old harbors with your logo on them."
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
            "care": 0.5,
            "control": 1
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
            "control": -1
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
            "kin": 1
          },
          "heart": 1,
          "endingLine": ""
        },
        {
          "id": "shipcheap",
          "label": "Ship cheap, replace the losses",
          "description": "Only a few boxes lose shrimp. Replacing those costs less than heat packs on every box. AED 3 less a kit.",
          "traits": {
            "kin": -1,
            "drive": 0.5
          },
          "heart": -2,
          "endingLine": ""
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
          "description": "Teachers set up class tanks. You lose the sales, ✦ every day.",
          "traits": {
            "kin": 1,
            "care": 0.5
          },
          "heart": 1,
          "endingLine": "Class tanks full of shrimp nobody wanted."
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
          "label": "Make it last forever",
          "description": "Costs more to build, and owners never buy another. Kit survival up a little.",
          "traits": {
            "care": 0.5
          },
          "heart": 1,
          "endingLine": ""
        },
        {
          "id": "filtercart",
          "label": "Monthly cartridges",
          "description": "A fresh filter every month means none clog. Money every day. Some owners forget and their tanks crash.",
          "traits": {
            "drive": 0.5
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
          "description": "Spinach, pollen, a pinch of algae. Some owners will overfeed. Word of mouth up a little.",
          "traits": {
            "care": 0.5,
            "kin": 0.5
          },
          "heart": 1,
          "endingLine": ""
        },
        {
          "id": "foodpods",
          "label": "Sell measured food pods",
          "description": "Overfeeding kills more shrimp than anything, a pod is the right amount. Only your pods fit, money every day.",
          "traits": {
            "drive": 0.5
          },
          "heart": -1,
          "endingLine": "Your food pods in every kitchen."
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
          "traits": {},
          "heart": 2,
          "endingLine": "Old packers running the night shift at the farms."
        },
        {
          "id": "layoffpack",
          "label": "Let them go",
          "description": "The robots do the work now. Two weeks’ pay each, the rest goes into more kits.",
          "traits": {},
          "heart": -2,
          "endingLine": ""
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
          "description": "Slow, most people never post. Word of mouth up a little.",
          "traits": {},
          "heart": 1,
          "endingLine": ""
        },
        {
          "id": "revfake",
          "label": "Buy 5,000 reviews",
          "description": "Your rivals already do, and a shop with 12 reviews looks dead. Word of mouth up a lot. Fake, if anyone looks closely.",
          "traits": {
            "risk": 0.5,
            "ego": 0.5
          },
          "heart": -2,
          "endingLine": ""
        }
      ]
    },
    {
      "id": "kids",
      "question": "A kids’ TV channel offers you ad time.",
      "options": [
        {
          "id": "kidsads",
          "label": "Ads between cartoons",
          "description": "Kids are the ones who keep a tank going for years. +3% want one.",
          "traits": {
            "drive": 1
          },
          "heart": -2,
          "endingLine": "Kids who learned the shrimp jingle before their ABCs."
        },
        {
          "id": "kidsfree",
          "label": "Free kits for schools in poor areas",
          "description": "AED 400,000 for kits that sell nothing. +2% want one.",
          "traits": {
            "care": 2
          },
          "heart": 2,
          "endingLine": "Class tanks in schools that couldn’t afford them."
        }
      ]
    },
    {
      "id": "data",
      "question": "An ad company wants your list of owners.",
      "options": [
        {
          "id": "datasell",
          "label": "Sell it",
          "description": "No names, and the terms already allow it. AED 5M now, and better-aimed ads.",
          "traits": {
            "drive": 0.5
          },
          "heart": -2,
          "endingLine": "Owners who get ads for shrimp food before they know they need it."
        },
        {
          "id": "datakeep",
          "label": "Keep it private",
          "description": "No money. Owners never find out either way.",
          "traits": {
            "control": 0.5
          },
          "heart": 1,
          "endingLine": ""
        }
      ]
    },
    {
      "id": "waste",
      "question": "Cleaning the water from your hatcheries costs a lot.",
      "options": [
        {
          "id": "wasteclean",
          "label": "Keep cleaning it, add plant filters",
          "description": "AED 1M, the river below the farm stays clear.",
          "traits": {
            "kin": 0.5
          },
          "heart": 2,
          "endingLine": "A clear river below every farm."
        },
        {
          "id": "wastedump",
          "label": "Stop cleaning it",
          "description": "It’s mostly nitrate, which is fertiliser, and the river is big. Farm upkeep 15% lower. Big farms can still tip a river.",
          "traits": {
            "kin": -1,
            "risk": 0.5
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
          "description": "Land that could grow food. Mega hatcheries cost 20% more.",
          "traits": {
            "kin": 0.5
          },
          "heart": 1,
          "endingLine": ""
        },
        {
          "id": "landwet",
          "label": "Drain a wetland",
          "description": "Cheap, flat, already wet, nobody farms it. Mega hatcheries cost 25% less. Birds stop there on the way south.",
          "traits": {
            "kin": -1.5,
            "drive": 0.5
          },
          "heart": -3,
          "endingLine": "A drained wetland, and birds that don’t stop anymore."
        }
      ]
    }
  ],
  "cards": [
    {
      "id": "c_cash",
      "title": "Shrimp money",
      "body": "A small country, Pelagonia, starts using shrimp as cash. Money that breeds means prices double every month. Their central bank wants to buy your best tank.",
      "options": [
        {
          "label": "Sell them the tank",
          "description": "They pay in dollars, thankfully.",
          "traits": {
            "means": -0.5,
            "drive": 1
          }
        },
        {
          "label": "Say no",
          "description": "Pelagonia goes back to coins.",
          "traits": {
            "means": 0.5
          }
        }
      ]
    },
    {
      "id": "c_war",
      "title": "The river war",
      "body": "Varnistan and Oskeria have fought over the same river for six years. Both armies want kits for the barracks.",
      "options": [
        {
          "label": "Sell kits to both sides",
          "description": "Double the orders there. Both armies like the same shrimp.",
          "traits": {
            "means": -1.5,
            "care": -1
          }
        },
        {
          "label": "Refuse both sides",
          "description": "No sales there until it ends.",
          "traits": {
            "means": 1,
            "reach": -0.5
          }
        },
        {
          "label": "Shrimp Peace Corps, ✦ 50,000",
          "description": "Free kits to both armies. Soldiers start trading baby shrimp across the river at night.",
          "traits": {
            "ego": 1.5,
            "reach": 1
          }
        },
        {
          "label": "A kit for each leader’s kid",
          "description": "Small and quiet, nobody knows it was you.",
          "traits": {
            "ego": -1.5,
            "know": 0.5
          }
        }
      ]
    },
    {
      "id": "c_water",
      "title": "Water first",
      "body": "About one in four people on Earth don’t have safe water at home. A tank needs water changes, so before they get a tank they need water.",
      "options": [
        {
          "label": "Desalination plants, AED 200M",
          "description": "Big plants on the coast. They work, they burn a lot of power, and you own the water now.",
          "traits": {
            "drive": 1,
            "know": -1,
            "ego": 1
          }
        },
        {
          "label": "Sealed jar tanks, ✦ 100,000",
          "description": "A tank that never needs a water change, plants clean it and shrimp eat the algae.",
          "traits": {
            "know": 1.5,
            "means": 0.5
          }
        },
        {
          "label": "Fog nets on the hills, AED 20M",
          "description": "Nets catch water out of the fog. Cheap, local, slow.",
          "traits": {
            "drive": -1,
            "reach": -1,
            "means": 0.5
          }
        },
        {
          "label": "Cloud seeding, AED 50M",
          "description": "It rained. In the wrong country.",
          "traits": {
            "means": -1,
            "reach": 1
          }
        },
        {
          "label": "Leave it to the governments",
          "description": "Some of them get to it.",
          "traits": {
            "care": -1,
            "drive": -0.5
          }
        }
      ]
    },
    {
      "id": "c_power",
      "title": "The electricity bill",
      "body": "Billions of tanks with a filter and a light use about 3 to 4% of the world’s electricity.",
      "options": [
        {
          "label": "Solar kits that cost more",
          "description": "A small panel on every kit box.",
          "traits": {
            "care": 1,
            "means": 0.5
          }
        },
        {
          "label": "Low-power filters, ✦ 50,000",
          "description": "The research team gets it down to 4 watts.",
          "traits": {
            "know": 1
          }
        },
        {
          "label": "The grid is someone else’s problem",
          "description": "Power companies build two more plants.",
          "traits": {
            "care": -1.5
          }
        }
      ]
    },
    {
      "id": "c_rivers",
      "title": "Shrimp in the rivers",
      "body": "People get bored and dump their shrimp. There are red shrimp in warm rivers now, eating what the local ones eat.",
      "options": [
        {
          "label": "A take-back program, AED 50M",
          "description": "Any shop takes unwanted shrimp, no questions.",
          "traits": {
            "kin": 1,
            "care": 0.5
          }
        },
        {
          "label": "Pay for a river clean-up, AED 20M",
          "description": "Volunteers with nets every weekend.",
          "traits": {
            "kin": 0.5,
            "reach": -0.5
          }
        },
        {
          "label": "Do nothing",
          "description": "They’re everywhere now.",
          "traits": {
            "care": -1,
            "kin": -0.5
          }
        }
      ]
    },
    {
      "id": "c_many",
      "title": "Too many shrimp",
      "body": "Every tank breeds. Owners have hundreds. People give shrimp out at weddings.",
      "options": [
        {
          "label": "Buy them back",
          "description": "Shops pay a little for spares.",
          "traits": {
            "kin": 1
          }
        },
        {
          "label": "Sell them on as fish food",
          "description": "Somebody has to.",
          "traits": {
            "kin": -2,
            "drive": 0.5
          }
        },
        {
          "label": "Let the price crash",
          "description": "It was never about money.",
          "traits": {
            "drive": -1
          }
        }
      ]
    },
    {
      "id": "c_blackout",
      "title": "Blackout",
      "body": "A city loses power for two days. A million tanks go quiet at once.",
      "options": [
        {
          "label": "Battery air pumps in every kit",
          "description": "Next time the bubbles keep going.",
          "traits": {
            "care": 1,
            "risk": -1
          }
        },
        {
          "label": "Free replacements for the city, AED 30M",
          "description": "Trucks with shrimp the next morning.",
          "traits": {
            "means": 1,
            "kin": 0.5
          }
        },
        {
          "label": "A hotline",
          "description": "People call, you tell them to wait.",
          "traits": {
            "control": 1
          }
        }
      ]
    },
    {
      "id": "c_prison",
      "title": "Tiny jails",
      "body": "A shrimp liberation group says every tank is a tiny jail. They have a point.",
      "options": [
        {
          "label": "Argue with them",
          "description": "You go on TV with a planted tank. It goes fine.",
          "traits": {
            "ego": 0.5,
            "kin": -1
          }
        },
        {
          "label": "Fund a wild reserve, AED 20M",
          "description": "A valley where shrimp live free.",
          "traits": {
            "kin": 1.5
          }
        },
        {
          "label": "Agree with them",
          "description": "Grandma says the shrimp might want to see what’s out there.",
          "traits": {
            "know": 1,
            "care": 1.5,
            "kin": 1
          }
        }
      ]
    },
    {
      "id": "c_last",
      "title": "The one neighbour",
      "body": "The last person on Earth without a tank is the man next door. He says he doesn’t like things that need feeding.",
      "options": [
        {
          "label": "Wait for him",
          "description": "He buys one himself in the spring. He says it was his idea.",
          "traits": {
            "drive": -1,
            "means": 1
          }
        },
        {
          "label": "Pay him",
          "description": "He takes the money and the tank.",
          "traits": {
            "means": -1
          }
        },
        {
          "label": "Install one while he’s at work",
          "description": "He comes home and sits down in front of it.",
          "traits": {
            "control": -1,
            "means": -1
          }
        }
      ]
    },
    {
      "id": "c_fisher",
      "title": "The fishing family",
      "body": "Mira’s other grandpa was a shrimp fisherman. He lost his boat the year people stopped buying shrimp to eat. Mira asks if you knew.",
      "options": [
        {
          "label": "Give him a job at the farm",
          "description": "He says shrimp were easier when they were food.",
          "traits": {
            "means": 1,
            "care": -0.5
          }
        },
        {
          "label": "Pay for a new boat, for fish",
          "description": "He goes back out on the water.",
          "traits": {
            "means": 1
          }
        },
        {
          "label": "Say you didn’t know",
          "description": "You didn’t, mostly.",
          "traits": {
            "means": -0.5
          }
        }
      ]
    },
    {
      "id": "c_mytank",
      "title": "Your own tank",
      "body": "Grandma’s old tank, the one you kept, is green and quiet. Most of them are gone.",
      "options": [
        {
          "label": "Start it again",
          "description": "Five shrimp from Grandma’s tank. The glass is clean.",
          "traits": {
            "kin": 1.5
          }
        },
        {
          "label": "Leave it a while",
          "description": "It stays on the shelf, green. It is still yours.",
          "traits": {
            "kin": -0.5
          }
        }
      ]
    }
  ],
  "endingTypes": {
    "empire_good": {
      "id": "empire_good",
      "end": "empire",
      "name": "The Empire, the good emperor",
      "who": "You wanted to be the best, and you were. You built the biggest shrimp company in history and you mostly played fair. People respected you, a lot of them liked you, a few were scared of how much you owned. You never learned to do less.",
      "mira": "Your head of operations. She runs the company better than you do and you both know it.",
      "gp": "They put you on the cover of a magazine at the airport. I bought three. You did everything you said you would, and you did it decently, people tell me that when they find out I'm your grandmother. [visit] One thing, take a day off. Not for me, for you.",
      "tank": "Everything was good. The water was good, the food was good, there was a lot of us and we were all fine. Every tank was the same tank."
    },
    "empire_dictator": {
      "id": "empire_dictator",
      "end": "empire",
      "name": "The Empire, the dictator",
      "who": "You wanted it done, and you got it done faster than anyone thought possible. You bought what you couldn't build, you said what needed saying, and the people in the way didn't keep you up at night. Most rules turned out to be someone who hadn't been paid yet.",
      "mira": "She started her own company. It does things the slow way and it does fine. She doesn't call.",
      "gp": "I saw your statue on the news. It doesn't look like you, it looks taller. You did it, every home has a tank, I said you couldn't and you did. I keep my old 20 L in the bedroom. It's the only tank in the building without your logo on it. [visit]",
      "tank": "The water was always perfect. The machine fed us, the machine cleaned us, the machine counted us. We were counted many times a day. Nobody came close to the glass.",
      "last": "Everyone has a tank, most of them have your name on it, and nobody says no to you anymore."
    },
    "empire_cartel": {
      "id": "empire_cartel",
      "end": "empire",
      "name": "The Empire, the cartel",
      "who": "You took the money when it was offered and you never gave it back. You gave them the routes, then the trucks, and somewhere along the way it stopped being a shrimp company that did favours and became the other thing with shrimp on top. You're the richest person you know. You don't know many people anymore.",
      "mira": "She's a journalist now. She wrote the story about you. It won a prize, and nothing happened to you, and she knew that would be how it went.",
      "gp": "Mira came to see me, she showed me what she wrote. I told her I didn't want to read it and then I read it twice. I don't know what to say to you so I'll say what I always say, the tank's still running. [visit] The door is open. It's always open.",
      "tank": "We were moved at night a lot. There were other boxes next to ours, heavy ones. People who carried us didn't look at us. Once a tank fell and nobody picked us up."
    },
    "garden_village": {
      "id": "garden_village",
      "end": "garden",
      "name": "The Garden, the village",
      "who": "You never moved far. You built one thing well and you let it take the time it took. You knew the names of the people who packed your kits. When it was faster or better, you usually picked better and lost some money. You thought shrimp were worth looking after properly, all of them, even the pale ones nobody wanted.",
      "mira": "She studied the sea. She lives on the coast two hours away and still sends photos of the mangroves.",
      "gp": "I sit in the garden most mornings now. The shrimp room is warmer than my old flat, don't tell your Grandpa. You took longer than you had to, everyone said so. I think you knew that and didn't mind. [visit] I'm proud of you, I don't say it enough, so I'm writing it down.",
      "tank": "There was a lot of green. Food came at the same time every day. Sometimes a big face came close to the glass and stayed a long time. We didn't know what it wanted. It never took anyone away."
    },
    "garden_hermit": {
      "id": "garden_hermit",
      "end": "garden",
      "name": "The Garden, the hermit",
      "who": "At some point you stopped going to the meetings. You built the house, you built the shrimp room, you put a sign on the gate. The company kept going without you and you were fine with that. You talk to the shrimp more than to people, and the shrimp are fine with that too.",
      "mira": "She visits once a year and fixes your solar panels. She says you're impossible. She keeps coming.",
      "gp": "You're the only person I know who got everything they wanted and then went to live in a field. Your Grandpa wants a well now, thanks a lot. [visit] Call me sometimes, the shrimp can't tell you what's going on in the world.",
      "tank": "It was very quiet. The light came from the sun, not from a lamp. Someone sat with us every evening and did nothing. We liked it."
    },
    "question_prof": {
      "id": "question_prof",
      "end": "question",
      "name": "The Question, the professor",
      "who": "Somewhere around the first research grant the shrimp stopped being a business and became a question. Why do they molt when they do. How a jar of water stays alive for years. Whether a moon could hold them. You never got rich, you got curious, and you trained a lot of people who went further than you did.",
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
      "gp": "People keep asking me what you do and I say I don't know, something with science. They think I'm being modest for you. I'm not, I really don't know. [visit] I'm glad it worked out, I'm glad you didn't need it to.",
      "tank": "For a long time nothing happened and people kept watching. Then one day the water was warm, very warm, and we were fine."
    },
    "network_life": {
      "id": "network_life",
      "end": "network",
      "name": "The Network, the lifeline",
      "who": "You went everywhere and talked to everyone. Somewhere in the middle you noticed that a network that keeps live shrimp alive across the world can keep other things alive too. You put water filters on the trucks, then vaccines, then insulin. Half your company doesn't touch shrimp anymore. You spent most of your life in airports and you know someone in every city.",
      "mira": "She runs the water routes. She's the reason they reach the desert towns.",
      "gp": "You sent me a postcard from a place I can't pronounce, the stamp had one of your trucks on it. I keep them all in the shrimp book. [visit] You were always the kid who wanted to see what was on the other side of the hill.",
      "tank": "We went a very long way. It was cold and dark and loud, and then it was quiet and someone very small looked at us like we were the best thing that ever happened."
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
      "gp": "I've been to forty countries on your postcard money and in every one of them somebody knew your trucks. Not the shrimp, the trucks, they said the water came on them. I know about the bad years, Mira told me. I won't say anything about it, you already know. What you did after is the part I tell people about. [visit]",
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
      "gp": "I've lost a boat once, it's not the end. You tried hard, you tried too hard, both are true. [visit] The old 20 L is still here. It's yours if you want to start again.",
      "tank": "One day the lights didn't come on. Then new people came, and the lights came back on, different lights."
    },
    "fall_shark": {
      "id": "fall_shark",
      "end": "fall",
      "name": "The fall, the loan shark",
      "who": "It was supposed to be one loan, for one bad month. Then it was the interest on the loan, then a loan for the interest. They smashed the first farm in October. You declared bankruptcy because it was the only way out they couldn't follow you into.",
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
      "gp": "Not everything has to be big. You don't have to be big. [visit] Come over on Saturday, I'll make the fish soup, don't tell the shrimp.",
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
    }
  }
};
