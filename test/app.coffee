express = require("express")

app = express()
app.use(express.static(__dirname))
app.listen(process.env.VCAP_APP_PORT || 3002)
