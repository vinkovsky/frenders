const express = require('express')
const next = require('next')
const Cors = require('cors')

const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


// Initializing the cors middleware
const cors = Cors({
	methods: ['GET', 'HEAD'],
})

app.prepare()
	.then(() => {
		const server = express();
		server.use(Cors())
		server.get('*', (req, res) => {
			return handle(req, res, cors)
		})

		server.listen(PORT, (err) => {
			if (err) throw err
			console.log(`Сервер запущен по адресу http://localhost:${ PORT }`);
		})
	})
	.catch((ex) => {
		console.error(ex.stack)
		process.exit(1)
	})