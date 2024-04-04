
var checkingAnimation = false

const ALLOW_LETTERS = 'abcdefghijklmnopqrstuvwxyz'

const LETTER_ANIMATION_TIME = 1

var word = null

var elements = null

const randomExemples = ['Ovo', 'Asa', 'Ele', 'Ama', 'Esse']

function init() 
{
	const checkButton = document.getElementById('check-button')
	checkButton.addEventListener('click', 
	function (e) 
	{
		if (!checkingAnimation)
		{
			startChecking(checkButton)
		}
	})
	
	const input = document.getElementsByName('word')[0]
	
	input.addEventListener('input', 
	function (e) 
	{
		let realword = ''
		for (let letter of input.value)
		{
			if (ALLOW_LETTERS.includes(letter.toLowerCase()))
			{
				realword += letter
			}
		}
		input.value = realword
		if (realword.length > 1)
		{
			if (checkButton.hasAttribute('disabled'))
			{
				checkButton.removeAttribute('disabled', 'true')
			}
		} else {
			checkButton.setAttribute('disabled', 'true')
		}
	})
	randomExemple()
}

function randomExemple() 
{
	const input = document.getElementsByName('word')[0]
	const random = randomExemples[Math.floor(Math.random() * (randomExemples.length - 1))]
	input.setAttribute('placeholder', 'Exemplo: ' + random)
}

function startChecking(button) 
{
	const letters = document.getElementsByName('word')[0]
	letters.setAttribute('disabled', 'true')
	setCheckingAnimation(true)
	sendLoadingAnimationInside(button, 2.3 * 1000, function () 
	{
		clearCheckBox()
		showAnimationBox(letters.value)
	});
}

function setCheckingAnimation(value) 
{
	console.log('Em animação foi setado como ' + (value ? 'Verdadeiro' : 'Falso'))
	checkingAnimation = value
}

function sendLoadingAnimationInside(element, duration, then) 
{
	const elementWidth = element.clientWidth
	const size = String((elementWidth / 100) * 20) + 'px';
	const loading = document.createElement('div')
	const oldProperties = element.innerHTML
	loading.classList.add('loading')
	loading.style.width = size
	loading.style.height = size
	element.innerHTML = ''
	element.appendChild(loading)
	setTimeout 
	(
		function () 
		{
			element.innerHTML = oldProperties
			removeAnimationInside(element)
			if (then instanceof Function)
			{
				then()
			}
		}, duration
	);
	
}

function removeAnimationInside(element) 
{
	const chield = element.querySelector('.loading')
	if (chield)
	{
		element.removeChild(chield)
	}
}

function clearCheckBox() 
{
	const box = document.getElementById('check-box')
	const all = []
	for (let child of Array.from(box.children))
	{
		all.push(child)
		box.removeChild(child)
	}
	elements = all
}

function showAnimationBox(letters) 
{
	const div = document.createElement('div')
	const box = document.getElementById('check-box')
	div.classList.add('check-animation')
	box.appendChild(div)
	let allLetters = []
	word = letters.toLowerCase()
	for (let letter of letters)
	{
		const uppercase = letter.toUpperCase()
		const child = document.createElement('h2')
		child.classList.add('check-animation-letter')
		child.textContent = uppercase
		div.appendChild(child)
		allLetters.push(child)
	}
	allLetters = allLetters.reverse()
	const time = LETTER_ANIMATION_TIME * 1000
	if (sendAnimationFromLetters(allLetters))
	{
		scheduleLetterAnimation(allLetters, time)
	}
}

function sendAnimationFromLetters(list) 
{
	const letter = list.pop()
	if (letter)
	{
		letter.classList.toggle('check-animation-letter-enabled')
	}
	return list.length > 0
}

function scheduleLetterAnimation(list, time) 
{
	setTimeout
	(
		function () 
		{
			if (sendAnimationFromLetters(list))
			{
				scheduleLetterAnimation(list, time)
			} else {
				showResult()
			}
		}, time
	)
}

function isPolindrome(value) 
{
	let reversed = value.split('').reverse().join('')
	return reversed.toLowerCase() === value.toLowerCase()
}

function showResult() 
{
	const resultBox = document.querySelector('.check-animation')
	let result = false
	if (word != null)
	{
		result = isPolindrome(word)
	}
	
	let text = 'A palavra "' + word + '" não é um Polidromo ❌'
	let newClass = 'false'
	
	if (result)
	{
		text = 'A palavra "' + word + '" é um Polidromo ✅' 
		newClass = 'true'
	}
	
	newClass = 'check-animation-letter-' + newClass 
	
	const box = document.getElementById('check-box')
	for (let letter of resultBox.children)
	{
		letter.classList.toggle(newClass)
	}
	const paragraph = document.createElement('p')
	paragraph.textContent = text
	const backButton = document.createElement('button')
	backButton.classList.add('check-button')
	backButton.textContent = 'Voltar'
	backButton.addEventListener('click', 
	function () 
	{
		showElements()
		setCheckingAnimation(false)
	});
	backButton.style.backgroundColor = result ? 'rgb(51,209,77)' : 'red'
	box.appendChild(paragraph)
	box.appendChild(backButton)
}

function showElements() 
{
	const box = document.getElementById('check-box')
	box.innerHTML = ''
	for (let element of elements)
	{
		box.appendChild(element)
	}
	const input = document.getElementsByName('word')[0]
	input.value = ''
	input.removeAttribute('disabled')
	const button = box.querySelector('#check-button')
	button.setAttribute('disabled', true)
	randomExemple()
  }
