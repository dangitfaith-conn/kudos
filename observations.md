# Closing Observations and Summary: Faith's Version
## Day by Day Notes
#### Day 1: Product/Tech Requirements + High Level Scaffolding
- Took a lot of load when it came to generating a PRD and Tech Plan.  They were high-level but sound.
- Major differences in Chat vs Agent
    - In my limited experience with AI-native IDEs like Windsurf and Cursor, Chat is very strict about not changing code.  It will tell you to switch to Agent mode if I want to make any changes.  Chat is simply there for questions and ideation.
    - A stark contrast to VS Code with Gemini Chat Assist Plugin.  Chat is very willing to add code for you and did so very quickly.  Agent will change code for you, too, but has a different interaction to it.  Chat is like an eager collaborator who will talk you through your high-level ideas and apply them proactively.  Agent is like a mid-level/senior developer who will do whatever you tell it and it will list out all the steps it’s doing along the way. 
- Chat had trouble creating directories for you which will cause major bugs. 
    - Chat fails to create a folder, any files it wants to create under it will not be created or could land on the parent folder.  This causes a lot of confusion and bugs!
    - Agent will create directories for you but will ask you to execute bash commands (eg mkdir …)
- If you have the same file opened in 2 tabs, there’s a chance Gemini will dupe that code.  I had a couple of instances where it added the same block of code twice.  Telling Gemini to remove it opened up a can of worms and ended up having to fix it myself.
- Have to be careful balancing a socratic method with Gemini.  It worked great when checking for Gemini’s understanding of what you want.  It can however backfire (see Day 3).  
    - `I want to do x y z.  Do you have any questions before we proceed?`
    - `Before we make code changes, please show me in plain text what the file structure looks like.`


#### Day 2: More Coding
- At first, it often proactively code reviewed what we had in place.  This feels great at first but as the codebase grew, this seemed distracting and unnecessary.  I did prompt it `Please don’t suggest code improvement until prompted`, to which it agreed... but still did proactively reviewed code.  Ironically, the code improvements were on code that it first put down and I did not change.  I think any developer can relate to this and goes to show that nobody's code is perfect to start.  Some improvements that it suggested for itself:
    - Reducing redundancy and keeping in mind variable hoisting in JavaScript
    - Identifying bugs in executing SQL commands
- Given the amount of code being created, it was initially challenging to determine when to review Gemini’s work.  It started to feel more natural by Day 3 when everything was working end-to-end.  Takeaway here is that it may take time to develop intuition.
- Code reviews! It eagerly took on any suggestions for improvement.  I was actively reviewing the generated react components and made suggestions for extraction.  It led to cleaner, more readable code.

#### Day 3: Wrapping up with the last phase for MVP
- Has trouble with context switching.  Before we finished the final phase outlined in the tech plan, I decided to have it generate a test plan.  After creating an initial doc, I prompted it to go back to working on the next phase.  It thought we were starting at Phase 1 and attempted to recreate the files/folders that were already in place (and working!).  Was fortunately able to “talk it off the ledge” and get us back on track.  Lesson here: be extremely clear when switching between context and don’t let it determine where you left off.  Tell it where you left off!
- I was getting fatigued from trying to prevent it from making changes when I was not ready.  I changed my prompts to explicitly tell it:
    - `Before we make changes, please outline what we want to do in chat with plain text.`
    - `Note: it worked most of the time, but other times it will still proactively make changes.`
- Creating a test plan would be good upfront and would help handle weird edge cases.  In hindsight, I should have done this on Day 1.  One key thing I did was always ask if Gemini had follow up questions.  From that, it asked me a series of questions regarding potential missing features or critical edge cases not identified in the PRD.



## Takeaways
### Seeing the forest for the trees 
It's up to you to keep the high-level goal in mind, otherwise the both you and Gemini could be adding code that is myopic. Reference your plan and goals frequently when prompting.

### Great for ideation and documenting
I loved being able to generate a prd, tech plan, and test plan so quickly with Gemini.  I think the key here is to be detailed as you can upfront. Then let Gemini ask you follow-up questions.  I also appreciate the code comments Gemini quickly adds.  Very helpful for engineers of all levels.

### Save and Commit Aggressively
Cuz when Gemini screws up, it can obliterate giant pieces of code!  I had a few files that I thought were fine according to Chat's preview tool, only to find it was completely blank later.  Thank goodness for `git reset` and `ctrl-z.`

### Fast and Furious Prototyping
Great for prototyping!  Next time around, I might get something done in < 1 day now that I know the quirks and challenges of using VS Code + Gemini.

### Overcommunicate and Check for Understanding
Always set the context and check what Gemini is planning on doing next.  Tell it what it should know, otherwise it could hallucinate and come up with something out there.  At one point, it claimed there was a feature that didn't exist. Maybe this is good communication practice for aspiring leaders/mentors?

### You can create pretty clean code...
...if you already know what you're doing.  A seasoned engineer can nudge it in the right direction.  
You can tell Gemini what doesn't look right and it's quick to change/improve.  You can also ask it to review your code.  I can see this potentially making code reviews smoother.  A developer can work with Gemini before creating a pull request.  Saves time on roundtrips for code reviews.

### Less overhead for generating tests!
Another quality of life improvement for engineers, esp for teams who self QA.  Generating test cases and test plans can help ease the process of bug-bashing, later.

### Fatigue and developing intuition
I found myself fairly fatigued by end of Day 2 and going into Day 3.  Reflecting back, I think it's b/c I was in "micro-manager" mode, which isn't a mode I prefer to be in (and definitely not for a couple days straight).  I'm constantly having to check and double check with Gemini before we move forward.  However, that is the price of developing something quick.  I think for most people it will take some time to develop the intuition on when to "drive" (be the coder) vs being a "backseat driver" (being the prompter).

# Jon's Notes
## Observations
* As someone who has little experience in building an application from scratch, and minimal experience in front end development, I found Gemini Code Assist to be incredibly helpful.  I was able to stand up a fully functional application with a back and front end in 2 days.  Without Gemini's help, this task would no doubt have taken me much longer.
* I used Gemini in Chat mode to develop the application.  I found it to be very educational to follow the explanations of each instructional step that Gemini suggested. 
* I did find it sometimes tempting to just accept the code supplied by Gemini without taking the time to fully understand it.
* I switched to use Gemini in Agent mode to see if it could generate unit tests.
  * I found Agent mode to be easier to just click "Accept Changes" and have Gemini do all the work for you.  
  * Gemini had issues getting the unit tests to all pass.  It took more than 5 iterations for it to finally get all tests to pass.


## Differences in Approach: Faith vs. Jon
Faith and I had the idea of experimenting with Gemini individually and seeing how similar or different our applications turned out.  We both started off with the same requirements and tech plan docs that Faith generated on the first day (contained in [prd.md](prd.md) and [techplan.md](techplan.md)).

* Faith took the approach of using Gemini Code Assist in Agent mode while I used Chat mode.
* Faith took a more interactive approach, providing more guidance to Gemini and correcting mistakes Gemini would make.  I took a more "hands-off" approach, accepting all of Gemini's suggestions and adding files and code as instructed.  

After we both built out our applications we demoed them to each other.  
* Faith's version was definitely more professional looking, though I stopped frontend development after Gemini told me it was complete.  I'm thinking if I prompted Gemini to improve some of the UI styling, it would have improved the frontend experience some.
* There were some feature differences between our versions, namely that Faith's version had separated the "Give Kudos" feature to a separate UI, while mine was included in the Dashboard.


I used Gemini to compare our two branches and this is the output:
## Branch Comparison: `jon-implementation` vs. `faith-implementation`

Based on the file differences, the `faith-implementation` branch represents a major refactoring and restructuring of the project compared to the `jon-implementation` branch. Here are the main differences:

### Project Restructuring

*   **New Directory Structure:** The `faith-implementation` branch introduces a new, more organized directory structure. The original `kudos-backend` and `kudos-frontend` directories have been replaced by `server` and `client` directories, respectively.
*   **Clearer Separation:** This new structure creates a clearer separation between the backend and frontend code, making the project easier to navigate and maintain.

### Backend Changes

*   **Complete Rewrite:** The backend has been completely rewritten and is now located in the `server` directory.
*   **New Features:** The new backend includes several new features, as indicated by the file names:
    *   **Admin Panel:** `adminController.js` and `routes/admin.js` suggest a new admin panel with features for managing users and transactions.
    *   **Scheduled Jobs:** `scheduler/creditRefreshJob.js` indicates a new scheduled job, likely for refreshing user credits.
*   **Database Management:** The `faith-implementation` branch includes a new `db` directory with a `schema.sql` and `seeds.sql` file. This suggests a more robust approach to database management, with a clear schema definition and seed data.

### Frontend Changes

*   **Complete Rewrite:** The frontend has also been completely rewritten and is now located in the `client` directory.
*   **New UI Components:** The new frontend includes a host of new UI components, suggesting a more modern and feature-rich user interface. Some of the new components include:
    *   `AwardKudosForm.jsx`
    *   `CreateUserForm.jsx`
    *   `PendingTransactionsList.jsx`
    *   `UserManagement.jsx`
    *   `KudosBalanceCard.jsx`
*   **Improved State Management:** The presence of a `contexts/AuthContext.jsx` file suggests a more modern approach to state management, likely using React's Context API.

### Key Takeaway

The `faith-implementation` branch represents a significant evolution of the project. It introduces a more organized project structure, a completely rewritten backend and frontend, and a host of new features. This branch appears to be a more mature and well-structured version of the application.
