const menuToggle = document.querySelector('.menu-toggle')
const navigation = document.querySelector('.nav-links')

menuToggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open')
  menuToggle.setAttribute('aria-expanded', String(isOpen))
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation')
  menuToggle.querySelector('span').textContent = isOpen ? '×' : '☰'
})

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open')
    menuToggle.setAttribute('aria-expanded', 'false')
    menuToggle.setAttribute('aria-label', 'Open navigation')
    menuToggle.querySelector('span').textContent = '☰'
  })
})

const assistantMarkup = `
  <aside class="assistant" aria-label="Lloyd Security assistant">
    <button class="assistant-launcher" type="button" aria-expanded="false" aria-controls="assistant-panel">
      <span class="assistant-launcher-mark" aria-hidden="true">+</span>
      <span>Ask Lloyd</span>
    </button>
    <div class="assistant-panel" id="assistant-panel" hidden>
      <div class="assistant-heading">
        <div>
          <p class="assistant-kicker">Lloyd guide / online</p>
          <h2>How can we help?</h2>
        </div>
        <button class="assistant-close" type="button" aria-label="Close assistant">×</button>
      </div>
      <div class="assistant-messages" aria-live="polite">
        <div class="assistant-message assistant-message-bot">I can point you to the right security system or help you start a conversation with our team.</div>
      </div>
      <div class="assistant-prompts">
        <button type="button" data-assistant-prompt="Which system is right for me?">Which system is right for me?</button>
        <button type="button" data-assistant-prompt="I need help with cameras">I need help with cameras</button>
        <button type="button" data-assistant-prompt="Talk to an expert">Talk to an expert</button>
      </div>
      <form class="assistant-form">
        <label class="sr-only" for="assistant-input">Ask Lloyd a question</label>
        <input id="assistant-input" type="text" placeholder="Ask a question..." autocomplete="off" />
        <button type="submit" aria-label="Send question">↗</button>
      </form>
    </div>
  </aside>`

document.body.insertAdjacentHTML('beforeend', assistantMarkup)

const assistant = document.querySelector('.assistant')
const assistantLauncher = assistant.querySelector('.assistant-launcher')
const assistantPanel = assistant.querySelector('.assistant-panel')
const assistantClose = assistant.querySelector('.assistant-close')
const assistantMessages = assistant.querySelector('.assistant-messages')
const assistantForm = assistant.querySelector('.assistant-form')
const assistantInput = assistant.querySelector('#assistant-input')

function toggleAssistant(isOpen) {
  assistantPanel.hidden = !isOpen
  assistantLauncher.setAttribute('aria-expanded', String(isOpen))
  assistant.classList.toggle('is-open', isOpen)
  if (isOpen) assistantInput.focus()
}

function addAssistantMessage(text, kind) {
  const message = document.createElement('div')
  message.className = `assistant-message assistant-message-${kind}`
  message.textContent = text
  assistantMessages.appendChild(message)
  assistantMessages.scrollTop = assistantMessages.scrollHeight
}

function answerAssistant(question) {
  const normalizedQuestion = question.toLowerCase()

  if (normalizedQuestion.includes('camera') || normalizedQuestion.includes('video') || normalizedQuestion.includes('surveillance')) {
    return 'Our video surveillance systems bring cameras, analytics, and review together so your team can act on the details that matter. Explore the systems below or tell us what you need to protect.'
  }
  if (normalizedQuestion.includes('access') || normalizedQuestion.includes('door') || normalizedQuestion.includes('entry')) {
    return 'Access control helps you manage who can enter, where they can go, and when. It is a strong fit for doors, gates, credentials, and growing teams.'
  }
  if (normalizedQuestion.includes('alarm') || normalizedQuestion.includes('intrusion') || normalizedQuestion.includes('detect')) {
    return 'Alarm systems provide fast, clear signals for detection, response, and monitoring. Our team can help match coverage to your site and workflow.'
  }
  if (normalizedQuestion.includes('expert') || normalizedQuestion.includes('contact') || normalizedQuestion.includes('quote') || normalizedQuestion.includes('talk')) {
    return 'The best next step is a quick conversation. I’ll take you to our inquiry form so you can share a few details with the Lloyd team.'
  }
  if (normalizedQuestion.includes('right') || normalizedQuestion.includes('choose') || normalizedQuestion.includes('need')) {
    return 'We can help you compare access control, alarms, and video surveillance based on your site, team, and priorities. Start with our systems overview, then reach out for a recommendation.'
  }
  return 'I can help you explore access control, alarm systems, and video surveillance, or connect you with the Lloyd team. Try one of the prompts below.'
}

function handleAssistantQuestion(question) {
  const cleanQuestion = question.trim()
  if (!cleanQuestion) return
  addAssistantMessage(cleanQuestion, 'user')
  const pendingMessage = document.createElement('div')
  pendingMessage.className = 'assistant-message assistant-message-bot assistant-message-pending'
  pendingMessage.textContent = 'Thinking...'
  assistantMessages.appendChild(pendingMessage)

  fetch('/api/chat', {
    body: JSON.stringify({ message: cleanQuestion }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
    .then((response) => {
      if (!response.ok) throw new Error('Assistant request failed')
      return response.json()
    })
    .then((data) => {
      pendingMessage.remove()
      addAssistantMessage(data.reply || answerAssistant(cleanQuestion), 'bot')
    })
    .catch(() => {
      pendingMessage.remove()
      addAssistantMessage(answerAssistant(cleanQuestion), 'bot')
    })

  if (cleanQuestion.toLowerCase().includes('expert') || cleanQuestion.toLowerCase().includes('contact') || cleanQuestion.toLowerCase().includes('quote') || cleanQuestion.toLowerCase().includes('talk')) {
    const action = document.createElement('a')
    action.className = 'assistant-action'
    action.href = 'contact.html'
    action.textContent = 'Open inquiry form ↗'
    assistantMessages.appendChild(action)
  }
}

assistantLauncher.addEventListener('click', () => toggleAssistant(assistantPanel.hidden))
assistantClose.addEventListener('click', () => toggleAssistant(false))
assistantForm.addEventListener('submit', (event) => {
  event.preventDefault()
  handleAssistantQuestion(assistantInput.value)
  assistantInput.value = ''
})
assistant.querySelectorAll('[data-assistant-prompt]').forEach((prompt) => {
  prompt.addEventListener('click', () => handleAssistantQuestion(prompt.dataset.assistantPrompt))
})

const carousel = document.querySelector('.hero-visual')

if (carousel) {
const carouselTrack = carousel.querySelector('.carousel-track')
const carouselControls = document.querySelector('.carousel-controls')
const carouselDots = carouselControls.querySelector('.carousel-dots')
const carouselLink = carousel.querySelector('.carousel-cta')
const carouselImages = [
  { file: 'New-Header-For-Web-1.jpg', alt: 'Lloyd Security new header image', page: 'industriesWeServe.html' },
  { file: 'Residential-New-Pic.jpg', alt: 'Residential security system', page: 'homeAutomation.html' },
  { file: 'home-automation.jpg', alt: 'Home automation system', page: 'homeAutomation.html' },
  { file: 'access-control.jpg', alt: 'Access control system installation', page: 'accessControl.html' },
  { file: 'Fire-Header-Pic.jpg', alt: 'Fire protection and alarm system', page: 'alarmSystems.html' },
  { file: 'Commercial-Security-Rotator.jpg', alt: 'Commercial security system installation', page: 'industriesWeServe.html' },
]
let activeSlide = 0
let rotationTimer

carouselImages.forEach((image, index) => {
  if (index > 0) {
    const slide = document.createElement('img')
    slide.className = 'carousel-image'
    slide.src = `src/img/carousel/${image.file}`
    slide.alt = image.alt
    carouselTrack.appendChild(slide)
  }

  const dot = document.createElement('button')
  dot.className = 'carousel-dot'
  dot.type = 'button'
  dot.setAttribute('aria-label', `Show image ${index + 1}`)
  dot.addEventListener('click', () => showSlide(index))
  carouselDots.appendChild(dot)
})

const slides = [...carouselTrack.querySelectorAll('.carousel-image')]
const dots = [...carouselDots.querySelectorAll('.carousel-dot')]

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length
  slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeSlide))
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === activeSlide)
    dot.setAttribute('aria-current', dotIndex === activeSlide ? 'true' : 'false')
  })

  if (carouselLink) {
    const destination = carouselImages[activeSlide].page
    carouselLink.href = destination
    carouselLink.setAttribute('aria-label', `Learn more about ${carouselImages[activeSlide].alt}`)
  }
}

function startRotation() {
  clearInterval(rotationTimer)
  rotationTimer = setInterval(() => showSlide(activeSlide + 1), 3500)
}

carouselControls.querySelector('.carousel-prev').addEventListener('click', () => {
  showSlide(activeSlide - 1)
  startRotation()
})

carouselControls.querySelector('.carousel-next').addEventListener('click', () => {
  showSlide(activeSlide + 1)
  startRotation()
})

showSlide(0)
startRotation()
}

