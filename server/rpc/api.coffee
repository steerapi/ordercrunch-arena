exports.register = (app, api, middleware)->
  for k,v of api
    if typeof v == "function"
      fns = k.match /^(get|post|update|delete)(.*)$/
      method = fns[1]
      name = fns[2].toLowerCase()
      endpoint = "#{api.name}/v#{api.v}/#{name}"
      if typeof middleware == "function"
        app[method] endpoint, middleware, v
      else
        app[method] endpoint, v
