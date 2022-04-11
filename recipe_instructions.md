# How to add a Recipe

1. Create a new [Github Gist](https://gist.github.com/).
1. The "Gist description" *must start with* `[recipe]` for Tastebase to fetch it
1. Each gist can have multiple recipes (if you like). Add a new file for each and write out your recipe following the format below
1. Make sure you *Create a Public Gist* instead of a secret one.


## How to format your recipe

```
# Your recipe title

A description of your recipe!

type: dinner, lunch
servings: 4
ref: https://url_to_recipe.biz


1. Mix {1 stick of butter}, {some salt}, and {3.5 cups of sifted flour} to a bowl
1. Preheat oven to 350F /* This is a chef note: Maybe increase it to 400F? */



### Another section

Just use two or more `#` to add a new section

1. Just have {4lbs of saffron} to feel wealthy

```

- `type:`, `servings:`, and `ref:` are optionally, but let you add some meta data
- The current types in the system are `lunch`, `dinner`, `breakfast`, `bread`, `dessert`, `drink`, `snack`, `experiment`. Let me know if you want more added.
- Anything within `{  }` will be parsed as an ingredient. Tastebase is quite good at conversations/fractions and other names for units.
- You can have multiple sections for your recipe. Each section will have it's own ingredient list
- You can add chef notes by writing text in `/*    */`. This will be hidden normally, but you can toggle it on. Useful for experimenting
