import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-orange-800">
      <div className='max-w-7xl mx-auto px-6 py-6 md:py-4 flex items-center justify-center md:justify-between text-white font-medium'>
        <div>© {new Date().getFullYear()} Pokemon Fight</div>
        <div className="hidden md:block">Built with ❤️Jatin</div>
      </div>
    </footer>
  )
}
