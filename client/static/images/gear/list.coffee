text=""
fs = require "fs"
files= fs.readdirSync "."
for file in files
  text+="""
li.touchcarousel-item(id="gear#{file}")
  img(src='images/gear/#{file}', width='120', height='120', ng-click="add($event)")

"""
console.log text