'use strict';
const Alexa = require('ask-sdk-v1adapter');
const APP_ID = undefined;

/***********
Data: Customize the data below as you please.
***********/

const SKILL_NAME = "Five Minute Recipes";
const STOP_MESSAGE = "See you next time.";
const CANCEL_MESSAGE = "Okay. Do you want to hear a different recipe instead?";

const HELP_START = "I know how to make tasty meals in less than 5 minutes.";
const HELP_START_REPROMPT = "Just tell me what type of meal you'd like.";
const HELP_RECIPE = "Choose whatever recipe you want.";
const HELP_RECIPE_REPROMPT = "Just ask me for a recipe.";
const HELP_INSTRUCTIONS = "You can ask me to repeat the instructions or say 'next' to hear the next line of instructions.";
const HELP_INSTRUCTIONS_REPROMPT = "Hello.";
const HELP_CANCEL = "You can hear a new recipe or just not eat.";
const HELP_CANCEL_REPROMPT = "Not eating so far caused 100% of test subjects to die.";

const CHOOSE_TYPE_MESSAGE = "Welcome to five minute recipes! I know some cool breakfast, lunch, snack, or dinner foods. What kind of recipe are you looking for?";
const REPROMPT_TYPE = "You can choose a breakfast, lunch, snack, or dinner recipe. What type of recipe would you like to choose?";
const MEALTYPE_NOT_IN_LIST = chosenType => `Sorry, I couldn't find any recipes for ${chosenType}. Do you want a breakfast, lunch, dinner or snack recipe?`;

const RECIPE_ADJECTIVES = [
  "awesome",
  "super simple",
  "fun",
  "extremely tasty"
];
const SUGGEST_RECIPE = recipeName => `I found this ${_pickRandom(RECIPE_ADJECTIVES)} ${recipeName} recipe! Do you want me to tell you how to make ${recipeName}?`;
const MISUNDERSTOOD_RECIPE_ANSWER = "Please answer with yes or no.";
const NO_REMAINING_RECIPE = "This was it. I don't know any more recipes. Do you want to select a different meal type?"
const INGREDIENTS_INTRO = "You will need"; // Here follows a list of ingredients
const INGREDIENTS_ENDING = "Does that sound like a meal you want to eat?"; // Will be said after the list of ingredients


const FIRST_TIME_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last line of instructions again.";
const REPROMPT_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last line of instructions again.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Sorry, I didn't understand you there.";
const CLOSING_MESSAGE = "Wonderful. Hope you have a great meal, or as the Germans say, Guten Appetit!";

const recipes = {
  breakfast: [
    {
      name: "P B and J",
      instructions: [
        "You'll need some sandwhich bread, peanut butter and jelly of your choosing.",
        "Find some sandwich bread.",
        "Spread a thick layer of peanut butter onto the bread.",
        "Dump a huge spoonful of jelly on top of the peanut butter and spread it.",
        "There you go! You just made a delicious peanut butter jelly sandwich. Goodbye."
      ],
      ingredients: [
        "peanut butter",
        "jelly",
        "bread"
      ]
    },
    {
      name: "Cereal",
      instructions: [
        "You'll need some milk and cereal.",
        "Get a bowl",
        "Fill it half-way with cereal.",
        "Now fill up the rest of the bowl with milk.",
        "Mmmmmh. This is going to be some gooood breakfast."
      ],
      ingredients: [
        "cereal"
      ]
    },
    {
      name: "Bacon and Eggs",
      instructions: [
        "For this recipe you will need to buy some simple frying oil, four strips of bacon and two eggs.",
        "Spread a thin layer of oil on a pan and start heating it on the stove.",
        "Throw the bacon strips into the pan and wait until the bacon is significantly darker and crispy.",
        "Take out the bacon and put it aside. Get the eggs, open them and gently let their content into the pan.",
        "The eggs are done when all the egg white has become fully white and the yoke is still slightly liquid.",
        "Bam! That's what I call some sweet, awesome breakfast!"
      ],
      ingredients: [
        "bacon",
        "eggs"
      ]
    }
  ],
  lunch: [
    {
      name: "Potatoes and broccoli",
      instructions: [
        "You'll need some potatoes and broccoli for this... and of course water. But I don't think I need to mention that.",
        "Fill two pots with water, place them on the stove and turn up the heat all the way. Once the water is boiling put the potatoes in one pot and the broccoli in the other.",
        "Now, wait until the potatoes and broccoli have exactly the consistency you like.",
        "Excellent! This is some gooood eating."
      ],
      ingredients: [
        "potatoes",
        "broccoli",
        "water"
      ]
    },
    {
      name: "Sandwich",
      instructions: [
        "Call Subway and order a sandwich you really like.",
        "Wait until they deliver it. Maybe do some situps. That's really good for your body, so I've heard.",
        "Once the sandwich deliverer arrives, rejoice!"
      ],
      ingredients: [
        "nothing"
      ]
    },
    {
      name: "Brolied Lobster Tails with Garlic and Chili Butter",
      instructions: [
        "You know, several weeks ago I was in Europe. I tell you, that's really a continent worth seeing. So many different and cool countries.",
        "Germany, France, Poland, Italy, ... So much to see.",
        "Oh right... Brolied Lobster Tails with Garlic and Chili Butter. You don't really don't think you can do that in 5 minutes, right?",
        "Well you can't."
      ],
      ingredients: [
        "lobster tail",
        "garlic",
        "chili",
        "butter"
      ]
    }
  ],
  dinner: [
    {
      name: "Frozen Pizza",
      instructions: [
        "Did you know you don't even need to make your own pizza anymore these days? Incredible! Go and buy some!",
        "Preheat the oven at 180 degrees celcius.",
        "Once the oven is preheated put the pizza in there. But without the plastic wrap! That's really not fun to eat. I tell you, I knew a guy... but that's a story for another time.",
        "After 10 to 15 minutes take the pizza out of the oven. If you're really intro crusty pizza, you can wait 20 minutes. I've heard burned pizza is not as unhealthy as people might think."
      ],
      ingredients: [
        "frozen pizza",
        "an oven"
      ]
    },
    {
      name: "Ice cream",
      instructions: [
        "For this recipe you just need ice cream.",
        "Open your freezer, get the ice cream and a small spoon. Only weird people use big spoons to eat ice cream. Don't be weird.",
        "Enjoy the ice cream. Don't take too big of a bite! You might get brain freeze."
      ],
      ingredients: [
        "ice cream",
        "a spoon"
      ]
    },
    {
      name: "Steak and fries",
      instructions: [
        "Excellent choice! You'll need a fresh steak and some frozen fries.",
        "Preheat the oven and once it's done preheating put the fries in there.",
        "Use a black pan and start heating it up.",
        "Put the steak in the heated pan and shortly sear it from both sides.",
        "Now, turn down the heat on the stove and keep frying the steak for as long as you want. It really depends on how medium or well done you like your steak. So it's kind of hard for me to tell you how long to fry it. Just do what your heart tells you to do.",
        "Perfect. This is a really fancy meal."
      ],
      ingredients: [
        "steak",
        "fries",
        "oil"
      ]
    }
  ],
  snack: [
    {
      name: "Chips",
      instructions: [
        "Go to the closest supermarket and buy a bag of chips.",
        "Open the bag.",
        "Enjoy!"
      ],
      ingredients: [
        "chips"
      ]
    },
    {
      name: "Banana",
      instructions: [
        "If you happen to live in the jungle, you might find a banana on a tree somewhere. If you don't, you might have to go to a market close by.",
        "Pick a yellow banana. Don't pick a green banana. Those have to sit for a while before being edible. And we want this recipe to be done within 5 minutes. So seriously, don't screw this up. Pick a yellow banana!",
        "Feeling like a monkey today? Well that's important sometimes, too."
      ],
      ingredients: [
        "banana"
      ]
    },
    {
      name: "Beef Jerkey",
      instructions: [
        "Go to a grocery store and buy some beef jerkey.",
        "Great! Now open the bag.",
        "Have fun eating."
      ],
      ingredients: [
        "beef jerkey"
      ]
    }
  ]
};

/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)

const _getCurrentStep = handler => handler.attributes['instructions'][handler.attributes['current_step']];

const _intentAndSlotPresent = handler => {
  try {
    return handler.event.request.intent.slots.mealType;
  }
  catch (e){
    return false;
  }
};
const _selectedMealType = handler => {
  return _intentAndSlotPresent(handler) && handler.event.request.intent.slots.mealType.value;
};
const _checkMealTypePresence = handler => {
  return Object.keys(recipes).includes(_selectedMealType(handler));
};
const _setMealType = handler => {
  // Reset remaining recipes in case the user went back from before
  handler.attributes['mealType'] = _selectedMealType(handler);
  handler.attributes['remainingRecipes'] = recipes[handler.attributes['mealType']];
  handler.handler.state = states.RECIPEMODE;
  handler.emitWithState("Recipe");
  return true;
};

const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _pickRandom = (array) => array[_randomIndexOfArray(array)];

// Handle user input and intents:

const states = {
  STARTMODE: "_STARTMODE",
  RECIPEMODE: "_RECIPEMODE",
  INSTRUCTIONSMODE: "_INSTRUCTIONSMODE",
  CANCELMODE: "_CANCELMODE"
};


const newSessionhandlers = {
  'NewSession': function(){
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
};

const startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'NewSession': function(startMessage = CHOOSE_TYPE_MESSAGE){
    if(_checkMealTypePresence(this)){
      // Go directly to selecting a meal if mealtype was already present in the slots
      _setMealType(this);
    }else{
      this.emit(':ask', startMessage, REPROMPT_TYPE);
    }
  },
  'ChooseTypeIntent': function(){
    if(_checkMealTypePresence(this)){
      _setMealType(this);
    }else{
      this.emit(':ask', MEALTYPE_NOT_IN_LIST(_selectedMealType(this)), MEALTYPE_NOT_IN_LIST(_selectedMealType(this)));
    }
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
});

const recipeModeHandlers = Alexa.CreateStateHandler(states.RECIPEMODE, {
  'Recipe': function(){
    if(this.new){
      this.attributes['remainingRecipes'] = recipes[this.handler.attributes['mealType']];
    }

    if(this.attributes['remainingRecipes'].length > 0){
      // Select random recipe and remove it form remainingRecipes
      this.attributes['recipe'] = this.attributes['remainingRecipes'].splice(_randomIndexOfArray(this.attributes['remainingRecipes']), 1)[0]; // Select a random recipe
      // Ask user to confirm selection
      this.emit(':ask', SUGGEST_RECIPE(this.attributes['recipe'].name), SUGGEST_RECIPE(this.attributes['recipe'].name));
    }else{
      this.attributes['remainingRecipes'] = recipes[this.attributes['mealType']];
      this.handler.state = states.CANCELMODE;
      this.emitWithState('NoRecipeLeftHandler');
    }
  },
  'IngredientsIntent': function(){
    var ingredients = this.attributes['recipe'].ingredients.join(', ').replace(/,(?!.*,)/gmi, ' and'); // Add 'and' before last ingredient

    this.emit(':ask', `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`, `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`)
  },
  'AMAZON.YesIntent': function(){
    this.attributes['instructions'] = this.attributes['recipe'].instructions;
    this.attributes['current_step'] = 0;
    this.handler.state = states.INSTRUCTIONSMODE;
    this.emitWithState('InstructionsIntent');
  },
  'AMAZON.NoIntent': function(){
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_RECIPE, HELP_RECIPE_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.handler.state = states.CANCELMODE;
    this.emitWithState('AskToCancelHandler');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER, MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

const instructionsModeHandlers = Alexa.CreateStateHandler(states.INSTRUCTIONSMODE, {
  'InstructionsIntent': function(){
    const firstTimeInstructions = (this.attributes['current_step'] === 0) ? FIRST_TIME_INSTRUCTIONS : '';
    this.emit(':ask', `${_getCurrentStep(this)} ${firstTimeInstructions}`, REPROMPT_INSTRUCTIONS);
  },
  'NextStepIntent': function(){
    this.attributes['current_step']++;

    if(this.attributes['current_step'] < this.attributes['instructions'].length - 1){
      this.emitWithState('InstructionsIntent');
    }else{
      this.emitWithState('InstructionsEnded');
    }
  },
  'InstructionsEnded': function(){
    this.emit(':tell', `${_getCurrentStep(this)} ${CLOSING_MESSAGE}`);
  },
  'DifferentRecipeIntent': function(){
    this.handler.state = states.RECIPEMODE;
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_INSTRUCTIONS, HELP_INSTRUCTIONS_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.handler.state = states.CANCELMODE;
    this.emitWithState('AskToCancelHandler');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER, MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
  }
});


const cancelModeHandlers = Alexa.CreateStateHandler(states.CANCELMODE, {
  'NoRecipeLeftHandler': function(){
    this.emit(':ask', NO_REMAINING_RECIPE, NO_REMAINING_RECIPE);
  },
  'AskToCancelHandler': function(){
    this.emit(':ask', CANCEL_MESSAGE, CANCEL_MESSAGE);
  },
  'AMAZON.YesIntent': function(){
    this.attributes['current_step'] = 0;
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession', REPROMPT_TYPE);
  },
  'AMAZON.NoIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_CANCEL, HELP_CANCEL_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER, MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(newSessionhandlers, startModeHandlers, recipeModeHandlers, instructionsModeHandlers, cancelModeHandlers);
  alexa.execute();
};
