//--Copyright (c) Robert A. Howell  May, 2023
import { adviceData } from "./adviceData";

export function checkDataStringChangeNeeds(data: adviceData) {
  //slip advice ingress checks
  switch (data.slip.id) {
    case 22:
    case 48:
    case 67:
    case 203:
      // request is missing id, advice slip
      data.slip.id = 22;
      data.slip.advice = "Empty advice, please reload.";
    case 29:
      data.slip.advice = "As you get older, learn never to trust a ****.";
    case 33:
      data.slip.advice = "Don't let the ******** grind you down.";
    case 34:
      data.slip.advice = "To improve productivity, always have a ******** task to put off.";
    case 76:
      // string characters are unreadable --> use \u00e4
      data.slip.advice = "You will always regret the round of J\u00e4germeister.";
    case 80:
      data.slip.advice = "Opinions are like *********, everyone has one.";
    case 111:
      data.slip.advice = "You're not as *** as you think you are.";
    case 114:
      data.slip.advice = "Step 1. Give a ****. Step 2. Don't be a ****. Step 3. Know when to let go.";
    case 131:
      data.slip.advice = "You only live once.";
    case 146:
      data.slip.advice = "Today, do not use the words 'Kind of,' 'Sort of' or 'Maybe.' It either is or it isn't.";
    case 181:
      data.slip.advice = "Rule number 1: Try not to die. Rule number 2: Don't be a ****.";
      break;
  }
  return data;
}
