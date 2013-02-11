body = $("body")
window.moveFromTo = (from, to, dur=500)->
  elm = $(from)
  target = $(to).offset()
  target.width = 0
  target.height = 0
  elm.clone().positionOn(elm).appendTo(body).animate target, dur, ->
    $(this).remove()