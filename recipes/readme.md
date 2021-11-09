# How to create a recipe

### Instructions

1. Create a new folder for yourself
1. Click into that folder
1. Click 'Add File'
1. Name your file `[your_recipe_name].md`. Use only lowercase letters and underscores.
1. Paste the following into your file

```
---
name: Your Recipe Name
desc: Brief Description
chef: Your Name
type: drink
servings: 1
img: false       //Optional Image url
tags:
	- some
	- fun
	- tags
---

Type out your recipe here....

```





### Ingredients

ingredients in your recipe are indicated with surounding `{}`, eg. `{white bread}` or `{can of tomato soup}`. If your ingredient has a quantity and/or unit, use a `|` to separate the quantity/units from the name, eg. `{2 slices | white bread}`, `{1/2tsp|cinnamon}`. This lets TasteBase parse out the quantities in order to automatically scale amounts based on servings, and allow for unit conversions (if possible).




### Metadata

title: Golden Milk
desc: A cozy turmeric latte
img: https://images.media-allrecipes.com/userphotos/960x960/4543554.jpg
chef: scoot
type: drink
link: false
servings: 1
tags:
	- turmeric
	- spice





### Notes

You can also add notes to your recipe. This is useful if it's a work in progress, or you want to make a note of something you'd like to change next time. This syntax is the same as programming style comments; both single line and multiline comments are supportted.

By default these are hidden, but a user can toggle them on in the UI.

