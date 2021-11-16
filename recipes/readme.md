# How to create a recipe

### Instructions

1. Create a new folder for yourself
1. Click into that folder
1. Click 'Add File'
1. Name your file `[your_recipe_name].md`. Use only lowercase letters and underscores plz.
1. Paste the following into your file

```
# Your Recipe Name

Brief Description of your amazing recipe

![](https://optional_img_url.biz)

type: breakfast
servings : 2  /* Tastebase defaults to 2 servings, but you can override it */


1. Grab {1cup of milk} and {43.5 grams oil}
1. Mix and Season with {oregano}
1. Set your furance to 2000F and yeet it in, cuz this is trash

/* You can also add chef notes in comments */

```



### Ingredients

Ingredients in your recipe are indicated with surounding `{}`, eg. `{jam}`, `{2 slices of white bread}` or `{3 4/5tsp of truffle oil}`. This lets Tastebase parse out the ingredients, quanitites and units of your recipes to automatically create an ingredient summary, but also allow the user to dynamically scale quantities based on serving size, and also convert between units (if possible).


### Notes

You can also add notes to your recipe. This is useful if it's a work in progress, or you want to make a note of something you'd like to change next time. This syntax is the same as programming style multiline comments, `/* yo yo yo */`

By default these are hidden, but a user can toggle them on in the UI.

