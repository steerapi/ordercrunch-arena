window.ss = require("socketstream")

ss.server.on "disconnect", ->
  console.log "Connection down :-("

ss.server.on "reconnect", ->
  console.log "Connection back up :-)"

ss.server.on "ready", ->
  # Wait for the DOM to finish loading
  jQuery ->
    # Load app
    require "./animate"
    require "./index"
    # require "/customer"
    # require "/carousel"
# $('.element').clone().clonePosition($('.element')).css('position','fixed').appendTo($('body')).animate(target, 1000, function(){ $(this).remove(); });
