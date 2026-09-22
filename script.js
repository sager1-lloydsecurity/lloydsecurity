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

const carousel = document.querySelector('.hero-visual')

if (carousel) {
const carouselTrack = carousel.querySelector('.carousel-track')
const carouselDots = carousel.querySelector('.carousel-dots')
const carouselImages = [
  { file: 'Commercial-Security-Rotator.jpg', alt: 'Commercial security system installation' },
  { file: 'access-control.jpg', alt: 'Access control system installation' },
  { file: 'Fire-Header-Pic.jpg', alt: 'Fire protection and alarm system' },
  { file: 'Residential-New-Pic.jpg', alt: 'Residential security system installation' },
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
}

function startRotation() {
  clearInterval(rotationTimer)
  rotationTimer = setInterval(() => showSlide(activeSlide + 1), 5000)
}

carousel.querySelector('.carousel-prev').addEventListener('click', () => {
  showSlide(activeSlide - 1)
  startRotation()
})

carousel.querySelector('.carousel-next').addEventListener('click', () => {
  showSlide(activeSlide + 1)
  startRotation()
})

carousel.addEventListener('mouseenter', () => clearInterval(rotationTimer))
carousel.addEventListener('mouseleave', startRotation)
carousel.addEventListener('focusin', () => clearInterval(rotationTimer))
carousel.addEventListener('focusout', (event) => {
  if (!carousel.contains(event.relatedTarget)) startRotation()
})

showSlide(0)
startRotation()
}

