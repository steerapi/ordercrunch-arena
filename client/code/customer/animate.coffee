body = $("body")
window.moveFromTo = (elm, tElm, dur=500)->
  target = tElm.offset()
  target.left += tElm.width()/2
  target.top += tElm.height()/2
  target.width = 0
  target.height = 0
  elm.clone().positionOn(elm).appendTo(body).animate target, dur, ->
    $(this).remove()