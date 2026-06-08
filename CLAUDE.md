# MD Translator

A local web app that reads a markdown file by path, stores it, and displays English-Chinese parallel translations paragraph by paragraph using DeepSeek.

## Workflow Requirements

- **Superpowers workflow is required** — always use the superpowers skill system (brainstorming → writing-plans → subagent-driven-development)
- **Parallel subagents are encouraged** — fan out independent tasks to parallel agents whenever possible

## Stack

- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS
- **Translation**: DeepSeek API (`deepseek-v4-flash`) via `openai` (OpenAI-compatible)
- **Cache**: Disk-based JSON in `translations/` dir, keyed by SHA-256 hash
- **Testing**: Jest + @testing-library/react

## Key Behaviors

- User inputs a local file path; the app reads and stores the markdown
- Each paragraph is translated EN→ZH using DeepSeek v4 flash
- Tech jargon and terms are preserved unchanged
- EN and ZH are displayed side by side per paragraph
- Runs locally
