text=""
fs = require "fs"
files= fs.readdirSync "."
for file in files
  text+="""
li.touchcarousel-item(id="drink#{file}")
  img(src='images/drink/#{file}', width='120', height='120', ng-click="add($event)")

"""
console.log text