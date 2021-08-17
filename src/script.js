const input = document.querySelector('input')
const letters = Array.from(document.querySelectorAll('[data-letter]'))
const spec = Array.from(document.querySelectorAll('[data-spec]'))
const contentAll = document.querySelector('.all_content')
const symbolsPerMinute = document.querySelector('#symbolsPerMinute')
const errorPercent = document.querySelector('#errorPercent')

const text = `Интеграл! по ориентированной области позитивно транслирует действительный полином. 
Максимум традиционно позиционирует косвенный минимум. Непрерывная функция, в первом приближении, 
реально раскручивает параллельный интеграл по поверхности. 
Интеграл по бесконечной области является следствием. Число е стремительно проецирует предел последовательности. 
То, что написано на этой странице неправда! Следовательно: предел функции независим. 
В соответствии с законом больших чисел, подмножество масштабирует интеграл по ориентированной области. 
Окрестность точки проецирует экспериментальный многочлен. 
Итак, ясно, что неравенство Бернулли уравновешивает убывающий Наибольший Общий Делитель.`


const party = partyCode(text)

console.log(party)

init()

function init() {
	input.addEventListener('keydown', keydownHandler)
	input.addEventListener('keyup', keyupHandler)

	viewUpdate()
}


function keydownHandler(event) {
	event.preventDefault()

	const el = letters.find(x => x.dataset.letter.includes(event.key))

	if (el) {
		el.classList.add('pressed')
		press(event.key)

		return
	}

	let key = event.key.toLowerCase()

	if (key === ' ') {
		key = 'space' 
		press(' ')
	}

	if (key === 'enter') {
		press('\n')
	}

	console.log(key)

	const newspec = spec.find(x => x.dataset.spec === key)

	if (newspec) {

		if (newspec.dataset.spec.toLowerCase() === 'shift') {
			const allShifts = document.querySelectorAll(`[data-spec="${newspec.dataset.spec}"]`)
			allShifts.forEach(shift => shift.classList.add('pressed'))
			console.log(allShifts)
		} else {
			newspec.classList.add('pressed')
		}

		return
	}

}

function keyupHandler(event) {
	
	const el = letters.find(x => x.dataset.letter.includes(event.key))

	if (el) {
		el.classList.remove('pressed')
		return
	}

	let key = event.key.toLowerCase()

	if (key === ' ') {
		key = 'space' 
	}

	if (key === 'enter') {
	}

	const newspec = spec.find(x => x.dataset.spec === key)

	if (newspec) {

		if (newspec.dataset.spec === 'shift') {
			const allShifts = document.querySelectorAll(`[data-spec="${newspec.dataset.spec}"]`)
			allShifts.forEach(shift => shift.classList.remove('pressed'))
		} else {
			newspec.classList.remove('pressed')
		}
		
		return
	}

}




function partyCode(text) {
	const party = {
		text,
		strings: [],
		currentStringIndex: 0,
		currentIndex: 0,
		errors: [],
		maxStringLength: 70,
		maxShowStrings: 3,
		started: false,

		statisticFlag: false,
		timerCounter: 0,
		startTimer: 0,
		errorCounter: 0,
		commonCounter: 0

	}

	party.text = party.text.replace(/\n/g, "")
	const words = party.text.split(' ')


	let string = []
	for (const word of words) {
		const newStringLength = [...string, word].join(' ').length + !word.includes('\n')

		if (newStringLength > party.maxStringLength || word.includes('\n')) {
			party.strings.push(string.join(' ') + ' ')
			string = []
		}

		string.push(word)

		if (word.includes('\n')) {
			party.strings.push(string.join(' '))
			string = []
		}

	}	

	if (string.length) {
		party.strings.push(string.join(' '))
	}

	return party
}


function press(letter) {

	party.started = true

	if (!party.statisticFlag) {
		party.statisticFlag = true
		party.startTimer = Date.now()
	}


	const stringer = party.strings[party.currentStringIndex]
	const mustLetter = stringer[party.currentIndex]
	console
	if (letter === mustLetter) {
		// console.log(1)
		party.currentIndex++
		if (stringer.length <= party.currentIndex) {
			party.currentIndex = 0
			party.currentStringIndex++

			party.statisticFlag = false
			party.timerCounter = Date.now() - party.startTimer

		}
	} else if (!party.errors.includes(mustLetter)) {
		party.errors.push(mustLetter)
		party.errorCounter++
		// console.log(2)
	}

	party.commonCounter++

	viewUpdate()
}


function viewUpdate() {

	const stringer = party.strings[party.currentStringIndex]

	const showedStrings = party.strings.slice(party.currentStringIndex, 
		party.currentStringIndex + party.maxShowStrings)
	const div = document.createElement('div')

	const firstLine = document.createElement('div')
	firstLine.classList.add('line', 'line-1')
	div.append(firstLine)

	const done = document.createElement('span')
	done.classList.add('done')
	done.textContent = stringer.slice(0, party.currentIndex)
	firstLine.append(done, ...stringer.slice(party.currentIndex).split('').map(letter => {
		if (party.errors.includes(letter)) {
			const errSpan = document.createElement('span')
			errSpan.classList.add('hint')
			errSpan.textContent = letter
			return errSpan
		}
		return letter
	})
	)


	for (let i = 1; i < showedStrings.length; i++) {
		const line = document.createElement('div')
		line.classList.add('line')
		div.append(line)

		line.append(...showedStrings[i].slice(0).split('').map(letter => {
			if (party.errors.includes(letter)) {
				const errSpan = document.createElement('span')
				errSpan.classList.add('hint')
				errSpan.textContent = letter
				return errSpan
			}
			return letter
		})
		)
	}

	contentAll.innerHTML = ''
	contentAll.append(div)

	input.value = stringer.slice(0, party.currentIndex)


	if (!party.statisticFlag && party.started) {
		symbolsPerMinute.textContent = Math.round((60000 * party.commonCounter) / party.timerCounter)
		errorPercent.textContent = Math.floor((10000 * party.errorCounter) / party.commonCounter) / 100 + '%'

		party.commonCounter = 0
		party.errorCounter = 0
	}

}









