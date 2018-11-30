const axios = require('axios')

let response = false

delay(10000).then(() => {
	return axios.get('https://google.com')
		.then(res => console.log(res) || (response = true))
		.catch(err => console.error('there was an error', err))
})

progress()

/*function progress () {
	setTimeout(
		() => {
			if (response) {
				console.log('done')
				return
			}

			console.log('waiting...')
			progress()
		},
		1000
	)
}*/

async function progress () {
	while (!response) {
		console.log('waiting...')
		await delay(1000)
	}
	console.log('done!')
}

function delay (time) {
	return new Promise(resolve => setTimeout(() => resolve(), time))
}
