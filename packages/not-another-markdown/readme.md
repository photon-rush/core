--------------------------------------------------------------------------------
# !Content
--------------------------------------------------------------------------------

1. Just a _quick_ test
aaab. This __should__ also work
1. And a <https://github.com> link.


Not _another_ markdown is a markdown like language that makes some changes to Markdown in order to expand its capabilities while making it safer and easier to use for multiple purposes. One of the main goals is to ensure that Not Another Markdown files remain easy to edit and read by themselves.

|>------------------------------------------------------------------------------
|> NOTE: Although this document has a ".md" file extension, it is actually a
|> Not Another Markdown (nam) file.
|>------------------------------------------------------------------------------
callout?

or not?


{toc}

# Introduction

## Scope

This document describes the "Not another Markdown" Language. As the name implies, this is not markdown or a strict superset of markdown but it does share a great deal of syntax with markdown.

## Goals

- Goal: NAM Source Text are easy to edit and read text documents.
- Goal: NAM Source Text syntax provides features document authors use frequently.
- Goal: NAM Data Structure provides a flexible document representation for a broad spectrum of renderers
- Goal: NAM Source Text is easy to parse.
- Goal: NAM Source Text provides best effort markdown compatibility.

## Anti-Goals

- Anti-Goal: Every Markdown file is compatible with NAM
- Anti-Goal: NAM Source Text can be rendered perfectly by Markdown renderers

## Summary of Changes

Many, if not most markdown files can be converted to NAM files with minor or no changes. Nevertheless there are some key differences between MD files and NAM files.

### Additions
- __Interactive Additions__: NAM syntax adds support for additional interactive components like form elements and multimedia embeds like videos. These features are "opt-in" for renderers, rather than "opt-out"

- __Expressive Additions__: In addition to some common features like tables, NAM adds callouts, definition lists, document metadata as well as a few others.

- __Documents__: Originally, markdown was conceived as being translated directly to HTML. On the other hand, NAM expects that NAM Source Text will be translated to a well defined document tree structure. This structure can be rendered as HTML or in to any other format desired.

### Subtractions
- __HTML Tags__: NAM Source Text does not support directly embedding HTML. While this is connivent in some contexts, it can also be dangerous and requires renderers to specifically filter out certain elements like script tags.

- __Certain Format Conventions__: A few formatting conventions that markdown allowed are not supported in NAM. The most notable difference is that NAM only supports defining headings on a single line, prefixed by the `#` sign

## Definitions

Throughout this document certain terms have specific meanings. Generally these are capitalized when found within the text itself.

- Source Text: A well formed sequence of unicode characters.
- Data Structure: The tree data structure that represents one or more NAM Documents
- Parser: A parser translates Source Text int to a Data Structure
- Renderer: A renderer translates Source Text in to some third format.
- Element: A conceptual part of the document with a specific purpose, like a Heading or List. An element here does not imply a direct translation to a single HTML Element.

## Documents

Conceptually, each NAM file is a document which is composed of sections, which are in turn composed of elements.


- A _Section_ divides a document in to structurally related parts. They aren't for organizing content.
- A _Block Element_ must always begin at the start of a line. Tables or blockquotes are examples of _Block Elements_
- A _Phrase Element_ can begin in most places but there are some exceptions. Links and strong text are examples of _Phrase Elements_


### Example Document Tree

```
┌──────────┐
│ Document │
└────┬─────┘
     │
     │    ┌──────────────────┐
     ├────┤ Section: Content │
     │    └────┬─────────────┘
     │         │
     │         │    ┌────────────────┐
     │         ├────┤ Block Elements │
     │         │    └────┬───────────┘
     │         │         │
     │         │         │    ┌─────────────────┐
     │         │         └────┤ Phrase Elements │
     │         │              └────┬────────────┘
     │         │                   │
     │         │                   │    ┌─────────────────┐
     │         │                   └────┤ Phrase Elements │
     │         │                        └─────────────────┘
     │         │
     │         │    ┌─────────────────┐
     │         └────┤ Phrase Elements │
     │              └─────────────────┘
     │
     │    ┌─────────────────────┐
     ├────┤ Section: References │
     │    └─────────────────────┘
     │    ┌───────────────┐
     ├────┤ Section: Meta │
     │    └───────────────┘
     │    ┌───────────────┐
     └────┤ Section: Note │
          └───────────────┘
```



### Sections

Each document always has four sections:

- __!CONTENT__: This is default and main section of the document.
- __!REFERENCES__: A section for keeping references and other information about the content of the document.
- __!META__: A section for keeping metadata about the document itself, typically things like author or publication date
- __!NOTE__: A section for adding notes about the content, designed for document authors to collaborate.


- Sections do not have to be defined, if a document does not explicitly create a NOTE section, it will be implicitly created but empty.
- If no section is defined, all elements are added to the CONTENT section
- Sections can be defined more than once, if they are, then their elements are concatenated in order.
- Custom sections can be defined, so long as they are not named like a predefined section and do not start with a `!`.
- Section names are case insensitive.
- Sections are not namespaces, that is ids and references defined in one section are valid in another.

#### Syntax

A section is created by wrapping a level one heading with horizontal rules like this:

```markdown
--------------------------------------------------------------------------------
# !REFERENCES
--------------------------------------------------------------------------------
```

You can use any style of horizontal rule, but the heading must be level 1.

### Text Level




### Block Level

#### Headings

All headings start on their own line and are prefixed with one or more hash `#` symbols.

#### Paragraphs

#### Tables

#### Blockquotes

#### Callouts

#### Includes

#### Code


#### Ordered Lists

#### Unordered Lists

#### Definition Lists

### Commands

| Command | Purpose                   | Param 1   | Param 2   | Param 3 | Param 4
|---------|---------------------------|-----------|-----------|---------|----------
| include | Includes another NAM file | url       |           |         |
| image   | Includes an image         | alt text  | title     | url     | reference
| link    | Create a link             | link text | title     | url     | reference
| frame   | Creates an iframe         | url       | width     | height  |
| video   | Includes a video          | url       | width     | height  |
| text    | Create a text input       | id        | label     | formId  |
| button  | Create a button input     | id        | label     | formId  |
| check   | Create a checkbox         | id        | label     | formId | checked
| radio   | Create a text input       | id        | formId    | selectedKey | key | value
| list    | Create a drop-down list   | id        | label     | formId
| form    | Create a text input       | id        | label
| toc     | Inserts the document table of contents |



#### Form

#### Text Input

#### Button

#### Radio

#### Checkbox


# Mechanics

This section covers parsing and rendering NAM.

This is a three step process:

Load -> Parse -> Render

- Loaders are not defined here except that they must produce valid source text (ST).
- Parsers translate valid ST in to valid data structures (DS)
- Renderers translate valid DS in to some other format such as a screen presentation or file format. Certain restrictions are placed on renders in how they interpret the DS.


## Source Text

- Source Text is a stream of unicode characters.
- Source Text is converted to a series of units called tokens which are then translated in to the Data Structure.

### Line Terminators

Line Terminator characters are specific Unicode code points that may separate tokens. They match those described in [ECMAScript](https://tc39.es/ecma262/#sec-line-terminators).

| Code Point | Unicode Name         | Abbreviation
|------------|----------------------|-------------------------------------------
| U+000A     | LINE FEED (LF)       | &lt;LF&gt;
| U+000D     | CARRIAGE RETURN (CR) | &lt;CR&gt;
| U+2028     | LINE SEPARATOR       | &lt;LS&gt;
| U+2029     | PARAGRAPH SEPARATOR  | &lt;PS&gt;


### Whitespace

Whitespace characters are specific Unicode code points that may separate tokens. Any code point in the general category Space_Separator (Zs) is considered Whitespace. They match those described in [ECMAScript](https://tc39.es/ecma262/#sec-white-space).

Addtinally the following code points are also considered Whitespace:

| Code Point | Unicode Name         | Abbreviation
|------------|----------------------|-------------------------------------------
| U+0009     | CHARACTER TABULATION | &lt;TAB&gt;
| U+000B     | LINE TABULATION      | &lt;VT&gt;
| U+000C     | FORM FEED (FF)       | &lt;FF&gt;
| U+FEFF     | ZERO WIDTH NO-BREAK SPACE | &lt;ZWNBSP&gt;

### Escape Sequence

Escape Sequences server two purposes:
- An escape sequence allows inserting a different code point than the one literally found in the Source Text.
- An escape sequence allows inserting a code point literally at locations where it would be used to delimitate tokens.

| Name          | Format | Purpose
|---------------|--------|----
| Character Literal | `/\\u[\dabcdefABCDEF]{4}/`| Insert a unicode code point anywhere in the Source Text.
| Character Escape | `/\\./` | Used to insert a character like `]` where it might otherwise be recognized as the start or end of a different token.

|> NOTE: Character Literals make is easy to create Source Text that is not well formed. Take care when using them. Its nearly always better just to insert the code points directly into the Source Text (via Copy+Paste for example).

|> NOTE: Character literals directly insert a character, if that character is syntactically important it would need to be escaped with the `\` character.

#### Examples

A link with a square bracket:

`[My Crazy Link\]](https://example.com)` ->  [My Crazy Link\]](https://example.com)

A Family

`\u1F468\u200D\u1F469\U200D\u1F466` -> \u1F468\u200D\u1F469\U200D\u1F466 (👨‍👩‍👦)

### Parsing






## Data Structure


## Rendering


This should fail too, but not anymore.