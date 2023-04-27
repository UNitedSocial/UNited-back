import 'dotenv/config'
import { App } from './app'
const app = new App().app

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT as string}`)
})

export default app
