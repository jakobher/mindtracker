import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import expressLayouts from 'express-ejs-layouts'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create Express app
const app = express()
const PORT = process.env.PORT || 3000

// Set up EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.set('layout', 'layouts/main')

// Static files
app.use(express.static(path.join(__dirname, './public')))

// Routes
app.get('/', (req, res) => {
    res.render('home/index')
  })


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})