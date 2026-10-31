# TX: writing (English)

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

| ID | Rule | Level | Check |
|---|---|---|---|
| TX-01 | **Em dash habit.** More than one em dash per 150 words in UI copy, docs or messages. Use a comma, colon, full stop or parentheses. | warn | static |
| TX-02 | **"Not just X, but Y".** The contrast construction ("It's not just a tool, it's a movement") used to sound profound. | warn | static |
| TX-03 | **Rule of three on repeat.** Lists of exactly three adjectives or clauses in sentence after sentence ("fast, simple, and powerful"). | warn | heuristic |
| TX-04 | **Hype vocabulary.** seamless, effortless, revolutionary, game-changing, cutting-edge, next-level, supercharge, unleash, elevate, empower, transform, robust, leverage, harness, delve, tapestry, realm, testament, beacon. | warn | static |
| TX-05 | **Throat-clearing openers.** "In today's fast-paced world", "In the ever-evolving landscape of", "Have you ever wondered", "Let's dive in", "In this article, we will". | block | static |
| TX-06 | **Summary that repeats the article.** "In conclusion", "To sum up", "In summary" followed by the points already made. | warn | static |
| TX-07 | **Cheerful sign-off.** "Happy coding!", "Hope this helps!", "Feel free to reach out!", "Let me know if you have any questions!" in docs, UI or commit text. | block | static |
| TX-08 | **Generic CTA.** "Get started", "Learn more", "Click here", "Read more", "Discover more" where the button could say what happens. | warn | static |
| TX-09 | **Headline formula.** "Unlock the power of X", "X made simple", "The future of X is here", "Supercharge your X". | warn | static |
| TX-10 | **Exclamation inflation.** More than one exclamation mark per screen or per 300 words. | warn | static |
| TX-11 | **Title Case Every Heading.** Applied by default rather than by the product's style guide. | warn | heuristic |
| TX-12 | **Hedge stack.** "might potentially", "could possibly", "it's worth noting that", "it's important to note that". | warn | static |
| TX-13 | **Whether you're X or Y.** "Whether you're a beginner or a pro", used as an audience opener. | warn | static |
| TX-14 | **Bold sprinkled through paragraphs.** Bold on phrases in most paragraphs, so nothing stands out. | warn | heuristic |
| TX-15 | **Bullets for prose.** Ideas that need a sentence chopped into one-line bullets with a bold lead-in each. | warn | heuristic |
| TX-16 | **Trailing significance clause.** A sentence that ends in "-ing" commentary: ", highlighting its importance", ", underscoring the need for", ", reflecting a broader shift". | warn | static |
| TX-17 | **Inflated importance.** "stands as a testament to", "plays a pivotal role", "marks a significant milestone", "leaves a lasting legacy" for ordinary things. | warn | static |
| TX-18 | **Nameless authority.** "Experts say", "Many believe", "Studies show", "Industry leaders agree" with no named source. | block | static |
| TX-19 | **False range.** "From startups to enterprises", "from design to deployment" where the two ends share no real scale. | warn | static |
| TX-20 | **Staccato negatives.** "No fluff. No jargon. Just results." Fragments that define a thing by what it lacks. | warn | static |
| TX-21 | **Rhetorical setup.** "The result?", "Here's the thing:", "The catch?", "Spoiler:" used to fake suspense before an ordinary point. | warn | static |
| TX-22 | **Synonym cycling.** The same subject renamed every sentence ("the tool", "the platform", "the solution", "this powerhouse") to avoid repeating a word. | warn | heuristic |
| TX-23 | **Assistant residue.** "Certainly! Here's", "Great question", "As an AI language model", "I hope this helps", knowledge-cutoff disclaimers, left in shipped text. | block | static |
| TX-24 | **Template slots left open.** "[Your Name]", "[Insert link]", "{company}", "2025-xx-xx" in published copy. | block | static |
| TX-25 | **Boilerplate outlook section.** A "Challenges and future prospects" or "Looking ahead" section that ends on vague optimism. | warn | heuristic |
