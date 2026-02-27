# Terra Backend Trial - Exercises

## About This Trial

This is a technical assessment to evaluate your skills. Your code will be reviewed for:

- **Code quality**: Clean, readable, and maintainable code
- **Problem-solving**: How you approach and solve the given challenges
- **Attention to detail**: Following the patterns and requirements specified
- **Error handling**: Robust handling of edge cases and failures

**Important:**
- You do NOT need to create new Astro components or split your code into multiple files
- Keep your implementation simple and contained within the specified class files
- Focus on functionality and code quality, not on architecture or abstractions

---

## Terra Class Pattern

At Terra, we follow a consistent class structure. Review `Project.js` and `Main.js` to understand the pattern:

```javascript
class Example {
    constructor() {
        this.DOM = {
            // All DOM references go here
            button: document.querySelector(".js--button"),
            items: document.querySelectorAll(".js--item"),
        }
        this.init();
        this.events();
    }

    init() {
        // Initialization logic: setup libraries, fetch data, configure state
    }

    events() {
        // All addEventListener bindings go here
        // Keeps event logic separated and organized
    }
}
```

**This pattern is expected in all your class implementations.**

---

## Exercise 1: Preloader blocking interaction
**Problem:** After page load, once the preloader fades out, elements are not clickable.

---

## Exercise 2: Load More with API and filters

**Objective:** Create a `LoadMore` class in `src/js/modules/LoadMore.js`.

**API:**
- Items: `https://www.sei.com/wp-json/wp/v2/insight`
- Taxonomies: `https://www.sei.com/wp-json/wp/v2/insight-types`

**Requirements:**
1. Must be a class with `export default`
2. Load items from API. One item is one c--card-a
3. Load taxonomies into dropdown
4. Filter by taxonomy when dropdown changes
5. Support query parameters (`?taxonomy=ID`)
6. Add more items when clicked on Load More. If filtered, add filtered items
7. Show/hide "Load More" button based on item count for that criteria
8. Robust error handling:
   - Solid timeout implementation
   - HTTP errors (4xx/5xx) with user-friendly messages in UI and technical logs in console

**CTA Insertion:**
- A `CtaB` component exists in the HTML after the first 4 cards
- When loading more items via API, the CTA must be preserved after every 4 cards
- The CTA should only be visible for certain taxonomy filters (implement conditional logic)

**Important - Why Vanilla JS:**
- Do NOT use Astro islands for this feature
- All dynamic content must be handled with vanilla JavaScript
- Reason: The page content is SEO-critical and must be server-rendered; client-side rendering should only enhance, not replace the initial content

**Notes:**
- You must wire up the class in `Main.js` following the Terra class pattern
- Default cards come from HTML, only replaced when filtering
- Review `CardA.astro` structure for card HTML
- Review `CtaB.astro` structure for CTA HTML
- WordPress API uses `X-WP-TotalPages` header for total pages
- After every Load more or filtering use src/pages/api/v1/render-content.js

---

## Exercise 3: URL Redirect Validator

**Objective:** Create a `UrlValidator` class in `src/js/modules/UrlValidator.js`.

**Functionality:**
- Input field where user enters a URL
- Calls the API endpoint at `/api/check-url`
- Displays redirect chain information (301, 302, 200)
- Shows how many redirects occur and final destination

**API Endpoint:** `POST /api/check-url`
- Already implemented in `src/pages/api/check-url.ts`
- Send `{ url: "https://example.com" }` in body

**API Response Structure:**

The endpoint returns detailed information about the redirect chain. Consider these scenarios:

```json
{
  "inputUrl": "https://example.com",
  "redirectCount": 2,
  "maxHops": 10,
  "maxHopsReached": false,
  "redirectLoopDetected": false,
  "final": {
    "url": "https://www.example.com/landing",
    "status": 200,
    "statusText": "OK",
    "headers": { ... }
  },
  "chain": [
    {
      "hop": 1,
      "url": "https://example.com",
      "status": 301,
      "statusText": "Moved Permanently",
      "redirectTo": "https://www.example.com",
      "headers": { ... }
    },
    {
      "hop": 2,
      "url": "https://www.example.com",
      "status": 302,
      "statusText": "Found",
      "redirectTo": "https://www.example.com/landing",
      "headers": { ... }
    },
    {
      "hop": 3,
      "url": "https://www.example.com/landing",
      "status": 200,
      "statusText": "OK",
      "redirectTo": null,
      "headers": { ... }
    }
  ]
}
```

**Think about these edge cases when displaying results:**
- What if `maxHopsReached` is `true`? (URL redirected too many times)
- What if `redirectLoopDetected` is `true`? (Infinite redirect loop)
- What's the difference between `301` (Moved Permanently) and `302` (Found/Temporary)?
- How should the UI differentiate between redirect statuses and final `200` OK?

**Requirements:**
1. Must be a class with `export default`
2. Validate input is a valid URL before calling API
3. Show loading state while checking
4. Display results in a user-friendly format showing the chain
5. Handle errors gracefully

**Notes:**
- You must wire up the class in `Main.js` following the Terra class pattern
- The HTML elements already exist in `index.astro` (`.js--url-input`, `.js--url-submit`, `.js--url-result`)
- Review the API endpoint implementation to understand the full response structure

---

## Submission

Once you have completed all exercises:

1. **Deploy to Netlify** - Share the live URL of your project
2. **GitHub Access** - Give us access to your repository so we can review your code

