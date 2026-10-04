# Catalog behavior

Use React Router q/category/sort/dr parameters as the source of shareable filter state. Flow responsive input through a 400 ms debounce into the URL, then into Query requests. Trim queries and omit defaults. Filter selections must work through the API and browser history. Add Clear filters, retain real totals and Load More, and handle invalid URL values. Verify refresh, Back/Forward, empty results, and return from details.
