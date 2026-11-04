window.ENDING_TEST_DATA = {
  "traits": [
    "drive",
    "means",
    "know",
    "kin",
    "care",
    "risk"
  ],
  "forks": [
    {
      "id": "science",
      "question": "Companies are offering your postdocs three times their pay.",
      "options": [
        {
          "id": "sciacad",
          "label": "Let them go, wish them luck",
          "description": "They go back to the universities. The ones who stay ask the big questions, and once in a while one finds something nobody was looking for.",
          "traits": {
            "care": 0.5,
            "drive": -0.3,
            "risk": 0.5
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
            "risk": -0.5
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
          "description": "Donors recognize your name and back the lab. More influence ✦ every day.",
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
          "endingLine": "A published study on shrimp and stress."
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
          "description": "Every breeder gets better shrimp, your rivals too. No license money. Word of mouth up a little.",
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
            "risk": 0.5
          },
          "heart": 1,
          "endingLine": "A newspaper that still makes fun of you."
        },
        {
          "id": "paperbuy",
          "label": "Buy The Shrimp Times",
          "description": "Its jokes scare off new buyers right when you need them. Owned, it stays on your side.",
          "traits": {
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
            "risk": 0.5
          },
          "heart": 2,
          "endingLine": "A pet welfare law that covers shrimp."
        },
        {
          "id": "lawbribe",
          "label": "Run your own audits instead",
          "description": "Your farms already pass. You publish your numbers and lobby to be exempt. Upkeep 15% lower. Smaller farms get the exemption too, and some of them don’t pass.",
          "traits": {
            "means": -0.5,
            "kin": -0.5,
            "risk": -0.5
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
          "description": "Crews learn fish farming and boat tours. The towns stop blaming you.",
          "traits": {
            "care": -0.5,
            "drive": -0.3
          },
          "heart": 2,
          "endingLine": "Old fishing crews running boat tours."
        },
        {
          "id": "harbors",
          "label": "Hire the crews at fishing wages",
          "description": "They know boats and nets, and they take less than your usual hires. Lake ranches 45% cheaper to set up.",
          "traits": {
            "drive": 0.7
          },
          "heart": -2,
          "endingLine": "Old fishing crews running your lake pens."
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
            "drive": -0.3,
            "risk": 0.5
          },
          "heart": 2,
          "endingLine": "A breeder co-op that started with your neighbor."
        },
        {
          "id": "buyout",
          "label": "Buy her out",
          "description": "Her kits die a lot, and every dead kit puts a family off shrimp. One seller, one standard, more orders come to you.",
          "traits": {
            "drive": 1,
            "risk": -0.5
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
          "description": "Every living tank gets a check-in call each month. It costs you AED 0.10 a tank a month, for as long as they keep it. More tanks thrive.",
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
          "description": "5,000 reviews in a month, all from real owners, mostly five stars. The marketplace labels them incentivized. Word of mouth up a lot.",
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
          "description": "60 days of income for class tanks that sell nothing. Slower, +2% want one.",
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
          "description": "No names, and the terms already allow it. AED 7.5M now, AED 10 for every new customer after, and better-aimed ads.",
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
          "description": "Farm upkeep 10% higher, the river below the farm stays clear.",
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
      "body": "Aspendos lent money to anyone who wanted to start a shrimp hatchery. Most of them failed. The bank wants to sell you the good ones cheap, the taxpayers cover the rest.",
      "options": [
        {
          "label": "Buy the good ones",
          "description": "Most of the workers keep their jobs. The taxpayers still pay for the ones that failed.",
          "traits": {
            "means": -0.5,
            "drive": 0.7,
            "care": -0.3
          },
          "endingLine": "You bought Aspendos's best hatcheries and kept most of the crews."
        },
        {
          "label": "Let the bank sell them off",
          "description": "Some workers lose their jobs. No public money goes into a failed boom.",
          "traits": {
            "means": 0.5,
            "drive": -0.5
          },
          "endingLine": "Aspendos’s bank sold the failed hatcheries for parts."
        }
      ]
    },
    {
      "id": "c_power",
      "title": "The electricity bill",
      "body": "Five billion tanks with a pump, a light and sometimes a heater use about 1% of the world’s electricity, dozens of power stations’ worth.",
      "options": [
        {
          "label": "Low-power kits",
          "description": "LED on a timer, a 1-watt pump, a heater only where it gets cold. AED 7.50 more a kit, and the lines retool for four months, 10% fewer kits a day.",
          "traits": {
            "know": 0.5,
            "care": 0.3,
            "risk": -0.5
          },
          "endingLine": "Every new kit has a light on a timer and a pump that uses a watt."
        },
        {
          "label": "Fund the engineers",
          "description": "A pump that uses less than a phone charger, in about a year. The utilities have to come in on it.",
          "traits": {
            "know": 0.3,
            "risk": 0.8
          },
          "endingLine": "Shrimp pumps use less power than a phone charger now."
        },
        {
          "label": "Leave it to the power companies",
          "description": "Kits stay cheap. They build more plants, mostly gas. 5% more people want one this year.",
          "traits": {
            "drive": 0.5,
            "care": -0.5,
            "know": -0.5
          },
          "endingLine": "Power companies built six gas plants for shrimp tanks. The hot towns got hotter."
        }
      ]
    },
    {
      "id": "c_rivers",
      "title": "Shrimp in the rivers",
      "body": "Some owners dump their shrimp when they get bored. Cherry shrimp breed in a few warm rivers now, one in Germany runs below a power plant. The river agencies want them out. The shops say most owners would hand them back if someone asked.",
      "options": [
        {
          "label": "Shops take them back",
          "description": "You pay the shops to run it, and stock goes to re-homing for six months, 15% fewer kits a day. The ones already in the rivers stay.",
          "traits": {
            "kin": 0.5,
            "care": -0.5,
            "risk": -0.3
          },
          "endingLine": "Unwanted shrimp go back to the shop, not the river."
        },
        {
          "label": "Clear the rivers",
          "description": "Permits and volunteers on every river. They catch most of them. The shrimp they catch are killed, an invasive species can’t go back in a river or a tank.",
          "traits": {
            "care": 0.5,
            "kin": -0.5,
            "risk": -0.5
          },
          "endingLine": "River teams cleared the red shrimp from the warm rivers. Most of them."
        },
        {
          "label": "Leave them",
          "description": "The shrimp rivers are a tourist thing now. 3% more people want a tank in those countries. Your money stays in kits.",
          "traits": {
            "kin": -0.5,
            "risk": 0.8
          },
          "endingLine": "Cherry shrimp live in warm rivers on four continents."
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
          "description": "Shops pay owners a little per shrimp, you pack them into kits. Free stock, 10% more kits a day for a year.",
          "traits": {
            "kin": 0.5
          },
          "endingLine": "Kit shrimp are second-hand now. Nobody minds."
        },
        {
          "label": "Sell them on as fish food",
          "description": "Somebody has to. The farms stay the only source.",
          "traits": {
            "kin": -1.5,
            "drive": 0.3
          },
          "endingLine": "Spare pet shrimp end up as fish food."
        },
        {
          "label": "Let the price fall",
          "description": "Cheap shrimp everywhere. Kits sell as a starter tank, not for the shrimp. 5% fewer kits this year, and word gets around, 2% more want one.",
          "traits": {
            "kin": -0.3,
            "drive": -0.5,
            "know": -0.3,
            "risk": 0.3
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
          "label": "Battery pumps for the hot cities",
          "description": "The cities hand out a battery air pump and the frozen-bottle trick before next summer. The owners who lost shrimp this time get nothing.",
          "traits": {
            "care": 0.5,
            "risk": -1
          },
          "endingLine": "Owners in hot cities keep a battery pump and a frozen bottle for the next blackout."
        },
        {
          "label": "Free replacements",
          "description": "New shrimp for everyone who lost theirs. Three days of farm output go to replacements, not kits. Kits can now come with a battery pump.",
          "traits": {
            "means": 0.5,
            "kin": 0.5,
            "risk": 0.3
          },
          "endingLine": "Everyone who lost shrimp in the blackout got new ones, and kits can come with a battery pump."
        },
        {
          "label": "A 24-hour help line",
          "description": "Move the tank to the floor, float a frozen bottle, skip feeding. Nothing else.",
          "traits": {
            "care": -0.5,
            "risk": 0.8
          },
          "endingLine": "A help line talked owners through the next blackout. Some tanks still died."
        }
      ]
    },
    {
      "id": "c_prison",
      "title": "Tiny jails",
      "body": "A shrimp liberation group says every tank is a tiny jail. A 20 L tank is small.",
      "options": [
        {
          "label": "Argue with them",
          "description": "You go on TV with a planted tank. It goes fine. Sales unchanged.",
          "traits": {
            "kin": -0.5,
            "risk": -0.3
          }
        },
        {
          "label": "Fund a wild reserve",
          "description": "You buy the valley out, and a government has to give it up. The farmers in it have to agree.",
          "traits": {
            "kin": 0.5,
            "care": 0.3,
            "risk": -0.3
          },
          "endingLine": "There’s a valley where shrimp live with no glass around them."
        },
        {
          "label": "Agree with them, on TV",
          "description": "You say it: a tank is small. 10% fewer people want one this year.",
          "traits": {
            "kin": 0.5,
            "drive": -0.5,
            "means": 0.5
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
            "care": -0.5,
            "drive": 0.3,
            "risk": -0.3
          },
          "endingLine": "Mira’s other grandpa works at your hatchery. He still calls them prawns."
        },
        {
          "label": "Help him start reef tours",
          "description": "Two weeks away fixing the boat with him. Orders run at half while you’re gone, and Grandma’s windows pass.",
          "traits": {
            "drive": -0.5,
            "means": 0.5,
            "risk": 0.3
          },
          "endingLine": "Mira’s other grandpa takes visitors out to the reef. Mira sends photos."
        },
        {
          "label": "A fund for every crew that lost work, 2% of income for two years",
          "description": "He gets the same as every other crew, no more.",
          "traits": {
            "care": 0.5,
            "means": 0.5,
            "kin": -0.3
          },
          "endingLine": "The fishing towns have a shrimp company to thank, and to blame."
        }
      ]
    },
    {
      "id": "c_permit",
      "title": "The permit",
      "body": "South Asia wants its own license before another kit is sold there. Water, animal health, packaging, three ministries. A year, they say, if the file is complete.",
      "options": [
        {
          "label": "Wait for the license",
          "description": "A year. Nothing sells in South Asia until then. Everything else runs.",
          "traits": {
            "means": 0.3,
            "risk": -1.1
          },
          "endingLine": "You waited a year for the South Asia license."
        },
        {
          "label": "Hire a firm that knows people",
          "description": "Four months. 1 in 5 that the Times finds out who the firm paid.",
          "traits": {
            "know": -0.3,
            "risk": 0.8
          },
          "endingLine": "A firm that knew people got you the South Asia license in four months."
        },
        {
          "label": "Ship under another company’s license",
          "description": "Sells from next month. 1 in 3, within two years, that every kit in the region is recalled.",
          "traits": {
            "risk": 0.5,
            "means": -0.3,
            "drive": 0.3
          },
          "endingLine": "You sold in South Asia under someone else’s license."
        }
      ]
    },
    {
      "id": "c_inspect",
      "title": "The inspection",
      "body": "The animal health inspector wants two weeks inside the mega hatchery, every line stopped, every tank sampled. Or last year’s numbers, which were fine.",
      "options": [
        {
          "label": "Shut the lines for the audit",
          "description": "Two weeks, 20% fewer kits a day. They find two things you didn’t know about.",
          "traits": {
            "know": 0.3,
            "risk": -1
          },
          "endingLine": "The inspector found two things. You fixed both."
        },
        {
          "label": "Show them last year’s numbers",
          "description": "The lines keep running. 1 in 4 that they come back unannounced.",
          "traits": {
            "means": -0.3,
            "know": -0.3,
            "risk": 0.8
          }
        }
      ]
    },
    {
      "id": "c_green",
      "title": "Green power where nobody needs it",
      "body": "A year after the solar farms, the engineers ask: keep building, in places that have enough electricity but make it from coal and gas?\n\nA gigawatt of solar or wind costs about AED 4B and makes 2 TWh a year. The world uses 30,000 TWh, 60% of it from coal and gas. One percent of the world’s power is 150 GW, about AED 600B. Sold at grid price it pays back in 10 to 12 years. Given away, it never does.",
      "options": [
        {
          "label": "Build 150 GW and sell the power",
          "description": "10% of income for eight years. Income back from year 11, a new finance line. The coal plants close as the price drops.",
          "traits": {
            "know": 0.5,
            "risk": 0.5,
            "drive": 0.3
          },
          "endingLine": "You built 150 GW of solar and wind. The power pays for itself from year 11."
        },
        {
          "label": "Build 150 GW and give it away",
          "description": "10% of income for eight years, nothing back. The coal plants close faster.",
          "traits": {
            "care": 0.7,
            "means": 0.5,
            "drive": -0.5
          },
          "endingLine": "You gave 300 TWh a year away. Forty coal plants closed."
        },
        {
          "label": "No, shrimp are the job",
          "description": "The farms you built keep running. Nothing new.",
          "traits": {
            "care": -0.7,
            "risk": -0.5
          }
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
          }
        },
        {
          "label": "Leave it a while",
          "description": "It stays on the shelf, green. It is still yours.",
          "traits": {
            "kin": -0.5,
            "drive": -0.5,
            "risk": 0.5
          }
        }
      ]
    },
    {
      "id": "c_knee",
      "title": "The knee",
      "body": "Grandma’s knee surgery is booked for the week of the Europe launch. She’ll need someone the first few days.",
      "options": [
        {
          "label": "Go with her, Europe opens in six months",
          "description": "You sit by her bed and read her the shrimp club newsletter. Europe waits.",
          "traits": {},
          "endingLine": "You put the Europe launch back six months for Grandma’s knee."
        },
        {
          "label": "Launch, she goes with an aunt",
          "description": "Europe opens on the date on the posters. Auntie Lan stays with Grandma for the week.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_strain",
      "title": "A hardier line",
      "body": "The farm can breed a hardier line. Fewer die in shipping, the color is a bit duller. While the line settles breeding is 85% lower, for three to six months, nobody knows how long.",
      "options": [
        {
          "label": "Switch, 85% less breeding for 3 to 6 months, kits survive better, 1% fewer want one",
          "description": "The new line goes into every rack.",
          "traits": {},
          "endingLine": "Your farms switched to a hardier, duller red."
        },
        {
          "label": "Test it on one rack for a year, then switch, six weeks of 85% less breeding",
          "description": "One rack gets the new line. Shipping losses stay as they are for now.",
          "traits": {},
          "endingLine": "You tested the hardier line on one rack for a year before switching."
        },
        {
          "label": "Keep the old line",
          "description": "Nothing changes. The red stays red.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_heat",
      "title": "Power cut",
      "body": "50 °C and the power is out. The chiller on your first tank has a battery, it’ll last the night. The rack room runs on the room AC. One battery, one room.",
      "options": [
        {
          "label": "Keep it home",
          "description": "Tank 1 makes it through the night. The rack room doesn’t.",
          "traits": {},
          "endingLine": "The racks lost everything the night the power went out."
        },
        {
          "label": "Move it to the farm",
          "description": "The racks make it. You can’t net them in the dark, so Tank 1 stays where it is.",
          "traits": {},
          "endingLine": "You gave the farm the battery the night the power went out. Tank 1 was empty in the morning."
        }
      ]
    },
    {
      "id": "c_jar2",
      "title": "The third floor, again",
      "body": "The man from the third floor is at your door. His daughter’s shrimp all died while she was at school. Jimmy, Jack, Jimbo, Jojo and Jaja. He asks for five more, she won’t know.",
      "options": [
        {
          "label": "Sell him five, AED 15",
          "description": "He pays at the door and takes them up in a cup.",
          "traits": {}
        },
        {
          "label": "Tell him to tell her, bring her over",
          "description": "She comes down the next day with the empty jar. You give her a care guide and five shrimp. She names them the same names.",
          "traits": {},
          "endingLine": "A girl on the third floor learned to keep shrimp from you."
        }
      ]
    },
    {
      "id": "c_lights",
      "title": "The lights",
      "body": "Half the grow lights in the rack room are the cheap kind now. One of the packers swapped them and sold the good ones. She’s short on rent, she looks after her little sister alone.",
      "options": [
        {
          "label": "Fire her",
          "description": "She clears her locker that afternoon.",
          "traits": {}
        },
        {
          "label": "Call the police",
          "description": "They take a statement. It goes to court in the spring.",
          "traits": {},
          "endingLine": "A packer of yours went to court over the grow lights."
        },
        {
          "label": "Raise her pay and keep her, AED 20 more a day",
          "description": "She’s at work early the next day. Maybe it happens again, maybe it doesn’t.",
          "traits": {},
          "endingLine": "You kept the packer who sold the lights and paid her more."
        }
      ]
    },
    {
      "id": "c_contam",
      "title": "The cleaning bucket",
      "body": "Someone rinsed a bucket of cleaning stuff into a breeding tank. Most of the shrimp lived. The ones that did will struggle to breathe and to molt, and they’ll get sick a lot.",
      "options": [
        {
          "label": "Clove oil, they go to sleep",
          "description": "It takes an afternoon. The tank is clean by evening.",
          "traits": {}
        },
        {
          "label": "Let them live out their lives",
          "description": "They get their own tank in the corner. Someone feeds them.",
          "traits": {},
          "endingLine": "A tank in the corner of the farm for shrimp that couldn’t breathe well."
        }
      ]
    },
    {
      "id": "c_cousin",
      "title": "The cousin",
      "body": "Your cousin is funny, everyone likes him, and he talks big. He’s never kept a job a year. He says he knows how to sell anything. Your aunt hopes you’ll help.",
      "options": [
        {
          "label": "Hire him as a regional manager, sales up a little, until he makes a mistake",
          "description": "He’s on the phone to every shop by Monday.",
          "traits": {},
          "endingLine": "Your cousin ran a region for a while."
        },
        {
          "label": "Don’t",
          "description": "Your aunt is quiet at the New Year dinner. Grandma tells you about it twice.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_letgo",
      "title": "Let them go",
      "body": "Mira wants to let her shrimp go in the stream behind the school. They’d be happier, she says. Cherry shrimp aren’t from here.",
      "options": [
        {
          "label": "Yes, they’ll be happier",
          "description": "She lets them go one at a time and waves at each.",
          "traits": {},
          "endingLine": "Mira let her shrimp go in the stream behind the school."
        },
        {
          "label": "No, they aren’t from here",
          "description": "She’s cross for a week. Then she asks what is from here.",
          "traits": {},
          "endingLine": "Mira knows which shrimp belong in the stream behind the school."
        }
      ]
    },
    {
      "id": "c_lie",
      "title": "How’s the company",
      "body": "Grandma calls. How’s the company.",
      "options": [
        {
          "label": "Tell her",
          "description": "She listens to all of it. Then she asks if you’re eating.",
          "traits": {}
        },
        {
          "label": "Say it’s fine",
          "description": "She says good, she knew it would be.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_pricewar",
      "title": "Price war",
      "body": "A rival cuts kit prices by a fifth. If you cut too you both earn less. If you hold and they keep cutting, they take some of your orders. They decide again every month.",
      "options": [
        {
          "label": "Hold your price",
          "description": "You keep your price. You find out each month what they did.",
          "traits": {}
        },
        {
          "label": "Cut it, 20% less on every kit for a year",
          "description": "Your price drops with theirs.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_wedding",
      "title": "The wedding",
      "body": "Kiki has packed your kits since the third week. She’s getting married in her village, a day’s drive away, the week of the Gulf launch. She’d like you there.",
      "options": [
        {
          "label": "Send a gift and stay for the launch",
          "description": "The Gulf opens on the day. Kiki sends a photo of the cake.",
          "traits": {}
        },
        {
          "label": "Go, the Gulf opens two weeks later",
          "description": "You dance badly. Kiki’s grandmother asks if you’re married.",
          "traits": {},
          "endingLine": "You went to Kiki’s wedding and the Gulf waited two weeks."
        }
      ]
    },
    {
      "id": "c_play",
      "title": "The school play",
      "body": "Mira is a tree in the school play on Thursday. She has one line. Thursday is also dinner with the investors, the round closes that night.",
      "options": [
        {
          "label": "Go to the dinner",
          "description": "The round closes. Mira’s mom sends a video of the play.",
          "traits": {}
        },
        {
          "label": "Go to the play",
          "description": "She says her line a bit too loud. She looks for you after and finds you.",
          "traits": {},
          "endingLine": "You saw Mira be a tree. It was the night the investors went elsewhere."
        }
      ]
    },
    {
      "id": "c_flood",
      "title": "The flood",
      "body": "The river floods. Your packers’ flats are under a meter of water. The same night a fishing town upriver loses its boats. You have one set of trucks and crews. Whoever you don’t help waits two months.",
      "options": [
        {
          "label": "The town first, your packers wait, 30% fewer kits for two months",
          "description": "Your trucks go upriver. Your packers sleep at the farm for two months, packing is slower.",
          "traits": {},
          "endingLine": "Your trucks went to the fishing town first after the flood."
        },
        {
          "label": "Your packers first, the town waits, a few fewer want one there",
          "description": "The crews pump out the flats in a week. Upriver they wait for the government.",
          "traits": {},
          "endingLine": "Your packers were back home a week after the flood."
        }
      ]
    },
    {
      "id": "c_bonus",
      "title": "A good year",
      "body": "A good year. There’s money left over, about a month of income.",
      "options": [
        {
          "label": "Give it to the hard part",
          "description": "It goes out with this month’s giving.",
          "traits": {},
          "endingLine": "You gave a good year away to people you never met."
        },
        {
          "label": "Share it with your people",
          "description": "Two packers put down deposits on flats. One sends her brother to college.",
          "traits": {},
          "endingLine": "You shared a good year with the people who’d been there since the jar."
        }
      ]
    },
    {
      "id": "c_nydin",
      "title": "New Year’s Eve",
      "body": "Tank 2 is molting badly. Three dead this morning, more stuck half out of their shells. It’s the night of Grandma’s New Year’s Eve dinner.",
      "options": [
        {
          "label": "Stay with the tank",
          "description": "You drip in mineral water all night. By morning nobody else has died.",
          "traits": {},
          "endingLine": "You spent one New Year’s Eve with a tank of molting shrimp."
        },
        {
          "label": "Go to the dinner, about half of tank 2 won’t make it",
          "description": "Grandma puts the fish on the table whole, for luck. Tank 2 is half empty when you get home.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_fair",
      "title": "The science fair",
      "body": "Mira’s school has a science fair. She wants two of your shrimp in a jar on her desk for two weeks, so people can watch them molt.",
      "options": [
        {
          "label": "Lend her two",
          "description": "She names them and feeds them too much. One comes back.",
          "traits": {},
          "endingLine": "Mira took two of your shrimp to the science fair. One came back."
        },
        {
          "label": "Say no, two weeks is long in a jar",
          "description": "She’s upset for a day. She does a poster about molting instead.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_vet",
      "title": "Money left over",
      "body": "A good quarter. There’s money left over, about a month of income, and nothing the company needs it for.",
      "options": [
        {
          "label": "Share it",
          "description": "Your aunt pays off her car. Grandma gets a new washing machine and keeps using the old one.",
          "traits": {},
          "endingLine": "You shared a good quarter with your family."
        },
        {
          "label": "Pay a vet",
          "description": "Dr. Haddad does a course in Singapore. She opens two days a week for fish and shrimp.",
          "traits": {},
          "endingLine": "There’s a vet in town who treats shrimp because of you."
        }
      ]
    },
    {
      "id": "c_price1",
      "title": "One price",
      "body": "Your kits cost the same everywhere. Where incomes are low that’s a week’s pay, and hardly anyone buys one.",
      "options": [
        {
          "label": "Half price where incomes are low, 3% of income from then on",
          "description": "Kits go on sale at half price in sixty countries. They sell.",
          "traits": {},
          "endingLine": "Your kits cost half as much where incomes are low."
        },
        {
          "label": "Keep one price",
          "description": "The price stays the same everywhere.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_wells",
      "title": "The wells",
      "body": "A dry year. The town upriver from your biggest farm lost its wells. Your farm has the engineers and the pumps to drill new ones.",
      "options": [
        {
          "label": "Send them",
          "description": "The farm crew drills for six weeks. The town has water by spring.",
          "traits": {},
          "endingLine": "Your farm crew drilled the wells upriver."
        },
        {
          "label": "Pay the tax",
          "description": "The tax goes to the district. The district drills the next year.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_feed",
      "title": "A new feed",
      "body": "The lab has a new feed. On paper the farms breed 8% more on it. Nobody has tried it on a whole farm.",
      "options": [
        {
          "label": "Test it first, no breeding for 2 months, then 15% back a month, then 8% more",
          "description": "The farms switch slowly. The lab weighs every batch.",
          "traits": {},
          "endingLine": "You tested the new feed before it went into every farm."
        },
        {
          "label": "Roll it out now, 1 in 3 it works, 2 in 3 no breeding for 2 months and a restock bill",
          "description": "The new feed goes into every farm tomorrow.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_budget",
      "title": "One budget",
      "body": "This year’s research money covers one thing. A study on whether shrimp feel pain, three years, it might find nothing. Or a clinic in the hot towns, where the heat makes people sick every summer.",
      "options": [
        {
          "label": "The pain study, 5% of income for 3 years",
          "description": "Three postdocs, two hundred shrimp, a lot of cameras.",
          "traits": {},
          "endingLine": "You paid three years to ask if shrimp feel pain."
        },
        {
          "label": "The clinic, 5% of income for 3 years",
          "description": "It opens in a school that’s empty in summer.",
          "traits": {},
          "endingLine": "You paid for a clinic in the hot towns."
        }
      ]
    },
    {
      "id": "c_bare",
      "title": "200 bare tanks",
      "body": "Your lab’s vision study needs 200 shrimp in bare glass tanks for a year. No plants, no gravel, so the cameras can follow them. Shrimp in bare tanks are stressed, some stop eating.",
      "options": [
        {
          "label": "Fund it, 1% of income for a year",
          "description": "The tanks go in a room with the lights low.",
          "traits": {},
          "endingLine": "Your lab kept 200 shrimp in bare tanks for a year to see what they see."
        },
        {
          "label": "Don’t, the postdoc who planned it leaves",
          "description": "She takes a job in Kyoto.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_glass",
      "title": "Glass shrimp",
      "body": "Your lab can breed a clear-shelled line. You can watch the heart beat through the shell. They’re easier to study and harder to keep alive. Half the first batch will die.",
      "options": [
        {
          "label": "Breed them",
          "description": "The first batch hatches see-through. Half of them die in the first month.",
          "traits": {},
          "endingLine": "Your lab bred see-through shrimp to watch their hearts."
        },
        {
          "label": "Don’t",
          "description": "The lab keeps using red ones.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_kyoto",
      "title": "Kyoto",
      "body": "You’re asked to speak at the shrimp biology meeting in Kyoto. It’s the week of Grandma’s birthday.",
      "options": [
        {
          "label": "Go, send her a cake",
          "description": "The talk goes fine. Somebody asks a question you can’t answer and you think about it the whole flight home.",
          "traits": {},
          "endingLine": "You spoke in Kyoto the week of Grandma’s birthday."
        },
        {
          "label": "Stay for her birthday",
          "description": "You bring the cake. She says it’s too sweet and has two pieces.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_saturday",
      "title": "Saturdays",
      "body": "Mira’s school wants someone to run a shrimp club on Saturday mornings. Saturday is when you change the tank water, vacuum the gravel, trim the plants, water the pots on the balcony, turn the compost and distill water to top up the tanks.",
      "options": [
        {
          "label": "Run the club, the tanks get Sunday evenings",
          "description": "Twelve kids, eleven jars. One asks why shrimp eat their old shells and you look it up together.",
          "traits": {},
          "endingLine": "You ran the school shrimp club on Saturdays."
        },
        {
          "label": "Keep Saturdays for the tanks and plants",
          "description": "The balcony tomatoes come in. The moss needs a trim again by Wednesday.",
          "traits": {},
          "endingLine": "Your Saturdays went to the tanks, the plants and the compost."
        }
      ]
    },
    {
      "id": "c_survey",
      "title": "The stream survey",
      "body": "A biologist in Taiwan asks you to spend a month in the mountain streams with her, counting wild cherry shrimp. Wet feet, no phone signal.",
      "options": [
        {
          "label": "Go",
          "description": "You count 3,412 shrimp under stones. Most of them are brown. A few are red.",
          "traits": {},
          "endingLine": "You spent a month counting wild shrimp in the streams of Taiwan."
        },
        {
          "label": "Pay for her trip",
          "description": "She sends a photo every few days, a stone, a hand, a shrimp.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_box",
      "title": "The new box",
      "body": "The lab has a new shipping box. It should cut deaths in the mail by a third. They want six months to test it before it goes out with every kit.",
      "options": [
        {
          "label": "Test it, six months with the old box",
          "description": "The old box goes out for six more months.",
          "traits": {},
          "endingLine": "You tested the new box for six months first."
        },
        {
          "label": "Ship it now, replace the dead if it fails",
          "description": "The new box goes out tomorrow.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_abroad",
      "title": "Three weeks",
      "body": "Your cousin starts university abroad. Your aunt was going to fly with her and settle her in, then had an emergency. She asks you to go instead, three weeks, you leave Thursday. It’s too late to find anyone to water the plants or feed the shrimp. Three weeks, they’ll probably be fine. Probably.",
      "options": [
        {
          "label": "Go with her",
          "description": "You carry two suitcases up four floors. She cries at the airport, then sends a photo of her new room.",
          "traits": {},
          "endingLine": "You flew your cousin to university and left the tanks for three weeks."
        },
        {
          "label": "Stay, she’s a big girl, she’ll be fine",
          "description": "Your aunt says of course. Your cousin sends a photo from the airport, on her own.",
          "traits": {}
        }
      ]
    },
    {
      "id": "c_sleep",
      "title": "Eight hours",
      "body": "The doctor says your blood pressure is up. Eight hours of sleep, she says, or pills.",
      "options": [
        {
          "label": "Sleep",
          "description": "You go to bed at ten. The first week you lie awake thinking about kits.",
          "traits": {},
          "endingLine": "You cut your hours for a year when the doctor asked."
        },
        {
          "label": "Keep your hours",
          "description": "The pills work. You set an alarm for them.",
          "traits": {}
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
      "mira": "Your head of operations. She runs the company better than you do.",
      "gp": "They put you on the cover of a magazine at the airport. I bought three. You did everything you said you would. [visit] One thing, take a day off. Come fishing.",
      "tank": "Everything was good. The water was good, the food was good, there was a lot of us and we were all fine. Every tank was the same tank."
    },
    "empire_dictator": {
      "id": "empire_dictator",
      "end": "empire",
      "name": "The Empire, the dictator",
      "who": "You wanted it done, and you got it done faster than anyone thought possible. You bought what you couldn't build and you said what needed saying. Most rules turned out to be someone who hadn't been paid yet.",
      "mira": "She started her own company. It does things the slow way and it does fine. She doesn't call.",
      "gp": "I saw your statue on the news. It doesn't look like you, it looks taller. You did it, faster than I ever thought. I keep a little jar in the bedroom. It's the only tank in the building without your logo on it. [visit]",
      "tank": "The water was always perfect. The machine fed us, the machine cleaned us, the machine counted us. We were counted many times a day. Nobody came close to the glass.",
      "last": "Most of the tanks have your name on them, and nobody says no to you anymore."
    },
    "empire_hard": {
      "id": "empire_hard",
      "end": "empire",
      "name": "The Empire, the hard bargain",
      "who": "You wanted it done and you did it on the numbers. You stayed inside the written law, used every loophole, and took the cheap way whenever it was legal. The people who worked for you got paid on time and not a penny more.",
      "mira": "She runs a smaller company that pays more and grows slower. She sends you a card every New Year.",
      "gp": "Your cousin says you're the cheapest rich person he knows. I told him that's how you got rich. [visit] Come for dinner, it's free.",
      "tank": "The water was fine and the food was the cheapest food. There were a lot of us. When some died, more came the next day."
    },
    "empire_cartel": {
      "id": "empire_cartel",
      "end": "empire",
      "name": "The Empire, the cartel",
      "who": "You took the money when it was offered and you never gave it back. You gave them the routes, then the trucks, and somewhere along the way, you gave them you and you became them. Your company stopped being a shrimp company that did favors and became something else with shrimp on top.",
      "mira": "She's a journalist now. She wrote the story about you. It won a prize, and nothing happened to you, and she knew that would be how it went.",
      "gp": "Mira came to see me, she showed me what she wrote. I told her I didn't want to read it and then I read it twice. I don't know what to say to you so I'll say what I always say, the tank's still running. [visit] Come for dinner, I'll leave the door unlocked.",
      "tank": "We were moved at night a lot. There were other boxes next to ours, heavy ones. People who carried us didn't look at us. Once a tank fell and nobody picked us up."
    },
    "garden_village": {
      "id": "garden_village",
      "end": "garden",
      "name": "The Garden, the village",
      "who": "You never moved far. You built one thing well and you let it take the time it took. You knew the family of the people who packed your kits. When it was faster or better, you usually picked better and lost some money. You thought shrimp were worth looking after properly, all of them, even the transparent ones nobody wanted.",
      "mira": "She studied the sea. She lives on the coast two hours away and still sends photos of the mangroves.",
      "gp": "I sit in the garden most mornings now. The shrimp room is warmer than my old flat. You took longer than you had to, everyone said so. I think you knew that and didn't mind. [visit] I'm proud of you, I don't say it enough... You grow up so well, it is so good that you were born.",
      "tank": "There was a lot of green. Food came at the same time every day. Sometimes a big face came close to the glass and stayed a long time. We didn't know what it wanted. It never took anyone away."
    },
    "garden_hermit": {
      "id": "garden_hermit",
      "end": "garden",
      "name": "The Garden, the hermit",
      "who": "At some point you stopped going to the meetings. You built the house, you built the shrimp room, you put a sign on the gate. The company kept going without you and you were fine with that. You talk to the shrimp more than to people.",
      "mira": "She visits once a year and fixes your solar panels. She says you're impossible but she keeps coming.",
      "gp": "You're the only person I know who got everything they wanted and then went to live in a field. Back in my days people would think you are crazy for wanting to live a life like my grandpa, haha. [visit] Call me sometimes, the shrimp can't tell you what's going on in the world.",
      "tank": "It was very quiet. The light came from the sun, not from a lamp. Someone sat with us every evening and did nothing. We liked it."
    },
    "question_prof": {
      "id": "question_prof",
      "end": "question",
      "name": "The Question, the professor",
      "who": "Somewhere around the first research grant the shrimp stopped being a business and became a question. Why do they molt when they do. How a jar of water stays alive for years. You didn't get rich. You trained a lot of people who went further than you did. ",
      "mira": "A marine biologist. She was one of your first scholarship students. She calls you her old professor even though you never taught her a class.",
      "gp": "I don't understand half of what you write to me now. I read it anyway, out loud, to the shrimp. You were always like this, you took the radio apart when you were six. [visit] Find out everything about shrimps, then come tell me.",
      "tank": "People watched us very carefully. They wrote things down. Sometimes they changed the water a little and waited to see what we did."
    },
    "question_lucky": {
      "id": "question_lucky",
      "end": "question",
      "name": "The Question, the lucky one",
      "who": "You funded people for years for no good reason. Nobody could tell you what the research was for and you paid anyway. Most of it went nowhere. One of them found the gene for heat tolerance, and that's why shrimp in hot countries don't need a cooler now. You never claimed it, you just kept paying.",
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
      "gp": "People tell me about you on the news and I don't know which story to believe, so I believe all of them a little. [visit] You can still stop. You should stop, you are still just a kid.",
      "tank": "We traveled all the time. Next to us there were always other boxes. Some went to hospitals. Some went to places where people were crying."
    },
    "network_back": {
      "id": "network_back",
      "end": "network",
      "name": "The Network, the one who turned back",
      "who": "You went everywhere, you talked to everyone, and for a few years you said yes to people you shouldn't have. Then one night you went to the police. It cost you almost everything. You rebuilt from the same trucks, and you made them carry the right things this time.",
      "mira": "She helped you through that year and didn't take any money. She runs your water routes now.",
      "gp": "I've been to forty countries since, and in every one of them somebody knew your trucks. Not the shrimp, the trucks, they said the water came to them. I know about the bad years, Mira told me. What you did was not easy, I am proud of you. [visit]",
      "tank": "We traveled a lot, always cold and always on time. Next to us there were boxes of other things, medicine sometimes, and for a long time things that weren't medicine. Then the boxes changed again."
    },
    "drift_shop": {
      "id": "drift_shop",
      "end": "drift",
      "name": "Home, the happy shop",
      "who": "You had one shop and it was enough. Some years you meant to open a second one and then it was summer. You kept the first shop while other people built the farms and the networks. You knew which kid named which shrimp.",
      "mira": "She paints shrimp. Nobody buys the paintings. Three of them hang in your shop and you will never sell them to others.",
      "gp": "Everyone keeps asking me if I'm disappointed you didn't do the big thing. I tell them I sit in your shop on Sundays and drink tea and look at the shrimp, why would I be disappointed. [visit]",
      "tank": "Nothing much happened, for a long time, in a good way. The cat watched us. We watched the cat."
    },
    "drift_famous": {
      "id": "drift_famous",
      "end": "drift",
      "name": "Home, accidentally famous",
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
      "mira": "She came to the auction and bought one tank, it's the model of the first one you ever sold her family.",
      "next": "Someone bought your farms cheap and finished the job. Everyone has a tank eleven years after you stopped.",
      "gp": "I've lost a boat once, it's not the end. You tried too hard, that's all. [visit] Your first tank is still on your shelf. Start again if you want. You are still a kid.",
      "tank": "One day the lights didn't come on. Then new people came, and the lights came back on, different lights."
    },
    "fall_shark": {
      "id": "fall_shark",
      "end": "fall",
      "name": "The fall, the loan shark",
      "who": "It was supposed to be one loan, for one bad month. You couldn’t pay him back and it grew 20% a month. You declared bankruptcy.",
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
      "who": "Someone offered you more money than you could spend and you took it. Maybe you were tired, maybe you'd done what you wanted, maybe the number was just too big. You bought a villa with no shrimp in it.",
      "mira": "She works for the company that bought you. She says they tripled the tank price.",
      "next": "They finished the job their way, faster in some places, worse in others. Everyone has a tank seven years after you sold. Your name isn't on any of them.",
      "gp": "So now you're rich and you're bored, I can tell from your letters. [visit] Buy a small tank, a 20 L, start again for fun. That's how it started last time.",
      "tank": "The logo on the box changed. Nothing else did."
    },
    "stream_world": {
      "id": "stream_world",
      "end": "garden",
      "name": "The Garden, the stream",
      "who": "You set out to put a tank in every home and somewhere along the way you stopped counting tanks. You cleaned the farm water, you planted the mangroves, you put native shrimp back in streams where they used to live.",
      "mira": "She runs the river surveys. She sends you a photo every Friday, a different stream each time, always with shrimp in it.",
      "gp": "I walked down to the stream behind the school today. Kids with nets, catching shrimp and letting them go. Nobody had to sell them anything. [visit] That's all I wanted, for people to stop and look.",
      "tank": "One day the glass wasn't there anymore. There was cold water and stones and a lot of others like us, and a child's face very close, looking."
    }
  }
};
