require('dotenv').config()

const createApp = require('./src/app')

const PORT = process.env.PORT || 5000

const app = createApp()
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ONPRINT API listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})
