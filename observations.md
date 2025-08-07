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
- At first, it often proactively code reviewed what we had in place.  This feels great at first but as the codebase grew, this seemed distracting and unnecessary.  I did prompt it “Please don’t suggest code improvement until prompted,” to which it agreed, but still did it.  Ironically, the code improvements were on code that it first put down and I did not touch.  I think any developer can relate to this and goes to show that it will not create perfect code to start.  Some improvements that it suggested for itself:
    - Reducing redundancy and keeping in mind variable hoisting in JavaScript
    - Identifying bugs in executing SQL commands
- Given the amount of code being created, at first it was hard to determine when to review Gemini’s work.  It started to feel more natural by Day 3 when everything was working end to end.  Takeaway here is that it may take time to develop intuition when to stop Gemini and take over.
- Code reviews! It eagerly took on any suggestions for improvement.  I was actively reviewing the generated react components and made suggestions for extraction.  It led to cleaner, more readable code.

#### Day 3: Wrapping up with the last phase for MVP
- Has trouble with context switching.  Before we finished the final phase outlined in the tech plan, I decided to have it generate a test plan.  After creating an initial doc, I prompted it to go back to working on the next phase.  It thought we were starting at Phase 1 and attempted to recreate the files/folders that were already in place (and working!).  Was fortunately able to “talk it off the ledge” and get us back on track.  Lesson here: be extremely clear when switching between context and don’t let it determine where you left off.  Tell it where you left off!
- I was getting fatigued from trying to prevent it from making changes when I was not ready.  I changed my prompts to explicitly tell it:
    - `Before we make changes, please outline what we want to do in chat with plain text.`
    - `Note: it worked most of the time, but other times it will still proactively make changes.`
- Creating a test plan would be good upfront and would help handle weird edge cases.  In hindsight, I should have done this on Day 1.  One key thing I did was always ask if Gemini had follow up questions.  From that, it asked me a series of questions regarding potential missing features or critical edge cases not identified in the PRD.



## Takeaways
### Seeing the forest for the trees 
It's up to you to keep the high-level goal in mind, otherwise the both of you could be adding code that is myopic. Reference your plan and goals frequently when prompting.

### Great for ideation and documenting
I loved being able to generate a prd, tech plan, and test plan so quickly with Gemini.  I think the key here is to be detailed as you can upfront. Then let Gemini ask you follow-up questions.  I also appreciate the code comments Gemini quickly adds.  Very helpful for engineers of all levels.

### Save and Commit Aggressively
Cuz when Gemini screws up, it can obliterate giant pieces of code!  I had a few files that I thought were fine according to Chat's preview tool, only to find it was completely blank later.  Thank goodness for `git reset` and `ctrl-z.`

### Fast and Furious Prototyping
Great for prototyping!  Next time around, I might get something done in < 1 day now that I know the quirks and challenges of using VS Code + Gemini.

### Overcommunicate and Check for Understanding
Always set the context and check what it's planning on doing next.  Tell it what it should know, otherwise it could hallucinate and come up with something out there.  At one point, it claimed there was a feature that didn't exist. Maybe this is good communication practice for aspiring leaders/mentors?

### You can create pretty clean code...
...if you already know what you're doing.  A seasoned engineer can nudge it in the right direction.  
You can tell Gemini what doesn't look right and it's quick to change/improve.  You can also ask it to review your code.  I can see this potentially making code reviews smoother.  A developer can work with Gemini before creating a pull request.  Saves time on roundtrips for code reviews.

### Less overhead for generating tests!
Another quality of life improvement for engineers, esp for teams who self QA.  Generating test cases and test plans can help ease the process of bug-bashing, later.