# Chorus Interview

## Work-in-Progress Status
This project is a Pokémon Team Builder application, which allows users to select 6 Pokémon from the first 150 Pokémon and submit their selection to the backend. Below is a summary of the progress made so far, expanding on the commit history:

### Initial Setup and Configuration:
- [x] Set up the initial project structure and configuration.
- [x] Get Nx building applications successfully.
- [x] Run migration scripts to update tooling since repo created 7 months ago.

### Testing and Development Cycle Improvements:
- [x] Updated configurations to locate the initial UI test.
- [x] Organized test specifications for simpler maintainability.
- [x] Enable Nx rebuilds on save for faster dev cycles.

### Front-End Development:
- [x] First substantive UI tests: Implemented the initial set of UI tests.
- [x] Build out front-end stub components to pass existing tests: Created stub components for the front-end to pass the existing tests.
- [x] Add basic asserts for team view contents: Added basic assertions for the team view contents.
- [x] Stub out teamSelectionView to pass written tests: Stubbed out the `teamSelectionView` component to pass the written tests.
- [x] `app.tsx` changes supporting the routes and views: Updated `app.tsx` to support the necessary routes and views.

### Back-End Development:
- [x] Create initial data entities: Created the initial data entities for the project.
- [x] Add the new db entities to the db-config service: Added the new database entities to the database configuration service.
- [x] Add basic controller and service to handle API requests: Implemented a basic controller and service to handle API requests.

### Testing and Configuration:
- [x] Playwright config changes: Updated the Playwright configuration for end-to-end testing.

## Next Steps
- [ ] Complete the Front-End UI:
  - [x] Continue building out the front-end UI to allow users to view the list of Pokémon.
  - [x] Select their team.
  - [x] Select Pokémon to add to their team.
  - [x] Captured Pokémon are added to the team.
  - [x] Front-end dynamically invalidates its query cache and refetches the updated team.
  - [ ] Leverage the response object on the front-end to update the cache without requerying the team.
  - [ ] Prompt to add an optional nickname for captured Pokémon.
  - [ ] Show captured Pokémon nicknames.

- [ ] Enhance Back-End Functionality:
  - [x] Expand the back-end functionality to handle the submitted Pokémon team data and integrate with the database.
  - [ ] Expand the back-end functionality to allow dynamic creation of user profiles
  - [ ] Support removal of pokemon from an existing team (releasing pokemon to the wild)
  - [ ] Improve Testing Coverage: Add more comprehensive back-end tests to ensure the functionality and reliability of the application.

## Prompt

Let's make a Pokémon Team builder!

We want to create a way to select 6 Pokémon to be on our team.

The UI should allow the user to:

1. View a list of the first 150 Pokémon.
2. Select from the list of Pokémon.
3. Submit the Pokémon that we have selected to the backend.

**It does not have to be a beautiful UX experience. We're aiming for functional.**

### Completion Criteria

#### Database Requirements
- There should be a Profile table.
- There should be a Pokémon table.
- There should be a relationship between Pokémon and Profiles.

#### UI Requirements
- Show a list of the first 150 Pokémon.
- Show selectable Profiles.
- Select a profile, and choose up to 6 Pokémon.

#### API Requirements
- Return Pokémon.
- Create Profiles.
- Handle receiving Pokémon related to Profiles.

## Submission Criteria

All of your work should be located in a GitHub Repo.

Ensure your repo is public, and submit the URL back to the hiring manager.
