## Again, but with feeling



- Additions to Markdown
    - ✔ Supports file metadata
    - ✔ Supports static file imports
    - ✔ Supports breaking documents in to sections
    - ✔ Supports tables (most people assume markdown supports this, but it doesn't out of the box)
    - ✔ Supports definition lists
    - ✔ Supports callouts
    - ✔ Supports automatic table of contents
    - ✔ Supports task lists
    - ✔ Supports text inputs
    - ✔ Supports button inputs
    - ✔ Supports radio inputs
    - ✔ Supports checkbox inputs
    - ✔ Supports custom text effects
    - ✔ Supports custom renderer/parser commands
    - ✔ Supports iframes

- Deletions from Markdown
    - ❌ No HTML Tags (angle brackets must be automatically escaped when rendered in HTML)
    - ❌ No "Setext" underlined headers.
    - ❌ No "atx" closing headers.
    - ❌ No indented code blocks
    - ❌ Some whitespace and line break differences

- Other Requirements (Not in Markdown)
    - ⚠ All documents MUST be encoded using UTF-8
    - ⚠ All documents coming from JavaScript strings MUST be "well formed"
    - ⚠ All line endings are defined as LF (U+000A)
    - ⚠ All path separators are defined as SOLIDUS (U+002F) (AKA foreword slash)


bottom text



- A normal List
    - Milk
    - Eggs
    - Butter
- Something not from a cow
    1. Widgets
    - Sprockets
    - Beans
1. ok, now things are screwed
- right?!

+ Another list
- This one combines bullets
* Hopefully thats ok?


1. An ordered list
1. Here is is
1. Item three


a. alpha
b. beta
c. charlie