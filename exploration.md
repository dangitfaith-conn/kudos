# New Kudos
This is a list of the initial requirements for the new Kudos project that we will feed into AI bot to help us plan and create the project.

## Project Description
We want to create a simple UI that is an award system for a set of users.  These users will have their own account.  Each user has two balances.  One to spend and one to award others.  These are separate values.  When a user receives an award from another user, that is their spending balance.  An admin is able to assign/give users an award balance at anytime.  The admin may also set up automation to refresh users' award balance.  Users can use their spending balance to buy gift cards and other items. 


## Requirements
### Read only experience
- Users are able to login 
- Users are able to view their current balance of their own credits and credits to giveaway
- Users are able to see their latest transactions
- Users are able to see the latest transactions

### Write experience
- Users are able to give credit to others
    - There is a screen where they see the credits they can give away
    - There is an input for the user to type in the recipient's name
        - Start with simple search, iterate to have suggestions based on search term
    - The screen will have an option to pick one of 5 categories that we'll call values
    - The screen will have a text field where the user can add a shoutout/public message to the recipient
- When the user confirms giving credit to another person, they are met with a confirmation page.  That transaction is shown as pending for the admin to view/approve/deny

### Admin Experience
- Admin is able to assign more credits to users
- Admin is able to review and approve/deny a transaction

## Path forward 
- Start with rough prototype that can handle the above experience using local storage if needed [easy]
- Iterate on experience with functioning backend [medium]
- Integration with the store [hard]
- Migrate old to new system


## Test Plan


## Questions
- [For much later] How will we migrate from the old system?  We'll need to look at the guts of the old system

- What is the database we're using?
MySQL

- What languages and frameworks do we want to use?
Full-stack javascript.  React as the framework on top of the frontend.  


## Other
APIs we know we'll need
- give
- award (admin)
- approve
- deny

Security is important: we want to avoid people finding a hack to assign themselves more credits to spend.

## Questions from Gemini
- **User Management & Authentication:**
  - How are users initially added to the system? Is there a self-service sign-up, or will an admin be responsible for creating all user accounts?
    - Answer: Admin will be responsible for creating users account.  For the prototype let's keep it low, roughly 5 accounts.  Keep in mind that we eventually want to onboard 200+ accounts.

  - For user login, what authentication mechanism should we plan for? (e.g., simple email/password, or integration with an SSO provider like Google, Okta, etc.)?
    - Answer: Eventually want to use SSO, but we can start simple with email/password.

- **Credits & Balances:**
  - What is the intended real-world value of a "spending" credit? Is there a conversion rate (e.g., 1 credit = $1), or are they abstract points? This will be important for the future "store" integration.
    - Answer: 1 credit = $0.50.
  - For the automated "award balance" refresh, what are the rules? For example, should it be "give every user 100 credits on the 1st of each month"?
    - Answer: Yes, that is correct.  The admin should be able to set a frequency (eg, weekly, monthly, yearly) and assign credits for those values.  Another automation is giving user credits for specific events, such as their birthday or work anniversary.  However, let's only focus on the former as this latter will be a later milestone.

- **Transactions & Visibility:**
  - The requirement "Users are able to see the latest transactions" — is this a global, public feed of all kudos given in the organization? Should it be anonymous, or display the sender, receiver, and message?
    - Answer: It should be global and public.  It should display all the information.  We may want to change this later, so keep this piece flexible.
  - When an admin denies a pending transaction, what should happen to the credits the sender tried to give? Should they be returned to the sender's "award balance"?
    - They should be returned.  There should be a simple notification on the denial.  I am open to what that would look like, as long as it's simple.
- **"Values" (Categories):**
  - Could you list the initial 5 "values" we should use for the awards?
    - Answer: I made a mistake, it's actually 4 values.  They are "Be Cool", "Be Courageous", "Be Connected", and "Be Curious."
  - Should these values be hardcoded for the prototype, or do we need an admin interface to manage them from the start?
    - Answer: Let's hardcode them.

- **Admin Role:**
  - How is a user's admin status determined? Is it a simple flag in the database? Can there be more than one admin?
    - Answer: There can be more than one admin, and yes let's keep it a simple flag in the database.

- **Automation Scope (Follow-up):**
  - For the automated "award balance" refresh, should the initial prototype include an admin UI to configure the frequency and amount, or should we start with a single, hardcoded rule (e.g., "give 100 credits on the 1st of every month") and build the configuration UI in a later iteration?
    - Answer: Let's start with a single, hardcoded rule.  We can build the configuration UI later.

## UI/UX Brainstorming

### Questions for Consideration
1.  **What's the desired aesthetic?** Are you picturing something clean and corporate like Google's apps, something more modern and friendly, or a completely custom look?
- Answer: I'm looking for something clean, friendly, and has some elements of fun.  An example of fun would be an occasional cute animation (like Twitter's like animation during a holiday or event)
2.  **How important is out-of-the-box functionality vs. customizability?** Do you prefer a library with pre-built, fully-styled components that work immediately, or a more flexible "headless" or utility-first framework that gives you total control over the design?
- Answer: I prefer utility-first. 
3.  **What's our priority?** Is it speed of development (getting a functional prototype up quickly) or creating a unique, branded look and feel?
- Answer: Speed of development for now.  We should revisit creating a unique experience after we have something working end-to-end, so let's make sure we keep things flexible.

### UI Framework Candidates

1.  **Material-UI (MUI)**
    *   **Description:** A comprehensive library of components that implements Google's Material Design.
    *   **Pros:** Massive component library, great for dashboards, excellent documentation.
    *   **Cons:** Can look very "Googley" by default, customization can be verbose.

2.  **Chakra UI**
    *   **Description:** A simple, modular, and accessible component library.
    *   **Pros:** Great developer experience, highly accessible, very composable.
    *   **Cons:** Smaller component set than MUI or AntD.

3.  **Ant Design (AntD)**
    *   **Description:** An enterprise-focused UI design language and React UI library.
    *   **Pros:** Professional look, rich components for enterprise apps.
    *   **Cons:** Can be "heavy" in terms of bundle size, complex customization.

## UI Framework Decision

### Recommendation
Based on the project goals, **Chakra UI** is the recommended framework. It perfectly balances the need for rapid development (priority #1) with the desire for a utility-first developer experience and a clean, friendly aesthetic. It provides pre-built components to speed up prototyping while offering easy, prop-based styling that aligns with the utility-first preference.

### Decision
The project will proceed using the **Chakra UI** component library for the frontend.