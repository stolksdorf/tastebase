# How to create a recipe

### Getting Started
1. Send Scott either your Github account name (if you have one) or the email address you'd like to use.
2. He will add you as a "Contributor" which will let you create and edit files on this repo
3. You should get an email with confirmation

### Your First Recipe

1. Make sure you are in the `tastebase/recipes` folder
1. Click 'Add File' -> 'Create new file'
2. Name your file: `/[your_name]/my_first_recipe.md`
3. Paste the following in your file:

```
# Your Recipe Name

> Brief Description of your amazing recipe

type     : food
servings : 2
img      :


1. Grab {1 cup of milk} and {43.5 grams oil}
1. Mix and Season with {oregano}
1. Set your furance to 2000F and yeet it in, cuz this is trash

### The sauce

You can also create multiple sections, with separate ingredient lists too, with {90lb of saffron}


```

4. After you commit your changes, it will take ~1min for it to show up on the site!



## Recipe Markup

Your recipe will be written in [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet). The top level header will become your recipe's title, the first paragraph it's description, and the first image will be the display image for your recipe (optional).


### Ingredients

Ingredients in your recipe are indicated with surounding `{}`, eg. `{jam}`, `{2 slices of white bread}` or `{3 4/5tsp of truffle oil}`.

This lets Tastebase parse out the ingredients, quanitites, and units of your recipes to automatically create an ingredient summary, but also allow the user to dynamically scale quantities based on serving size, and also convert between units (if possible).

### Temperature

Tastebase will automatically detect temperatures for both fahrenheit and celsius and provide conversions to the user for you. 


### Notes

You can also add notes to your recipe. This is useful if it's a work in progress, or you want to make a note of something you'd like to change next time. This syntax is the same as programming style multiline comments, `/* yo yo yo */`

By default these are hidden, but a user can toggle them on in the UI.

