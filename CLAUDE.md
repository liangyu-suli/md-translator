# MD Translator

A local web app that reads a markdown file by path, stores it, and displays English-Chinese parallel translations paragraph by paragraph using Gemini.

## Workflow Requirements

- **Superpowers workflow is required** — always use the superpowers skill system (brainstorming → writing-plans → subagent-driven-development)
- **Parallel subagents are encouraged** — fan out independent tasks to parallel agents whenever possible

## Stack

- To be determined during design

## Key Behaviors

- User inputs a local file path; the app reads and stores the markdown
- Each paragraph is translated EN→ZH using Gemini flash-lite
- Tech jargon and terms are preserved unchanged
- EN and ZH are displayed side by side per paragraph
- Runs locally
