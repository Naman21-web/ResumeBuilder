import { BookUserIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Title from './Title'

const Testimonials = () => {
  const testimonials = [
    {
      logo: "https://tailwindcss.com/plus-assets/img/logos/workcation-logo-indigo-600.svg",
      quote:
        "“Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.”",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      name: "Judith Black",
      title: "CEO of Workcation",
    },
    {
      logo: "https://tailwindcss.com/plus-assets/img/logos/workcation-logo-indigo-600.svg",
      quote:
        "“Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.”",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      name: "Harish Kumar",
      title: "Product Manager",
    },
    {
      logo: "https://tailwindcss.com/plus-assets/img/logos/workcation-logo-indigo-600.svg",
      quote:
        "“Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.”",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      name: "Aisha Khan",
      title: "Designer",
    },
  ]

  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)
  const featuredIndex = 1 // index of the large centered testimonial on large screens

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div id='testimonials' className="bg-white py-5 sm:py-5">
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-4 py-1.5 whitespace-nowrap">
          <BookUserIcon className='size-4.5 stroke-green-600'/>
          <span>Testimonials</span>
        </div>
      </div>

      {/* center the title and description */}
      <div className="mx-auto mt-6 max-w-2xl text-center">
        <Title title={"Don't just take our words"} description={"Hear what our users have to say about their experience with our resume builder. We're always improving our platform to make it easier for you to build a professional resume. If you have feedback, we'd love to hear it!"}/>
      </div>

      <section className="relative isolate overflow-hidden bg-white px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* grid: on lg screens use 4 columns so featured card can span 2x2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => {
              // Featured (center) card: large, shows quote by default
              if (idx === featuredIndex) {
                return (
                  <button
                    key={idx}
                    onClick={() => setActive(t)}
                    aria-expanded={active === t}
                    className="relative rounded-2xl p-8 bg-white shadow-xl text-left focus:outline-none lg:col-span-2 lg:row-span-2 flex flex-col justify-center"
                  >
                    <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 leading-snug">
                      {t.quote}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full ring-2 ring-gray-100 shadow-sm" />
                        <div>
                          <div className="font-semibold text-gray-900">{t.name}</div>
                          <div className="text-sm text-gray-500">{t.title}</div>
                        </div>
                      </div>
                      <img src={t.logo} alt="" className="h-10 opacity-80" />
                    </div>
                  </button>
                )
              }

              // Regular flipping card (only the hovered one flips; previous cards revert instantly)
              return (
                <button
                  key={idx}
                  onClick={() => setActive(t)}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(idx)}
                  onBlur={() => setHovered(null)}
                  aria-expanded={active === t}
                  className="group relative h-56 rounded-2xl p-0 focus:outline-none"
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className={`relative h-full w-full [transform-style:preserve-3d] ${
                      hovered === idx
                        ? 'transition-transform duration-700 [transform:rotateY(180deg)]'
                        : 'transition-none [transform:rotateY(0deg)]'
                    }`}
                  >
                    {/* Front face */}
                    <div className="absolute inset-0 rounded-2xl p-6 bg-gradient-to-br from-white to-green-50 shadow-md flex flex-col justify-between [backface-visibility:hidden]">
                      <div className="flex items-center justify-between">
                        <img src={t.logo} alt="" className="h-9" />
                        <div className="text-sm text-gray-500">{t.title}</div>
                      </div>

                      <div className="flex items-center gap-4">
                        <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full ring-2 ring-white shadow-sm"/>
                        <div>
                          <div className="font-semibold text-gray-900">{t.name}</div>
                          <div className="text-xs text-gray-500 mt-1">Hover to preview</div>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium">Read testimonial</span>
                        <span className="text-xs text-gray-400 group-hover:text-green-600 transition">→</span>
                      </div>
                    </div>

                    {/* Back face */}
                    <div className="absolute inset-0 rounded-2xl p-6 bg-white shadow-md flex flex-col justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-6">{t.quote}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                        <div className="text-xs text-green-600 font-medium">Click to expand →</div>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Modal */}
        {active && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
            onClick={() => setActive(null)}
            aria-modal="true"
            role="dialog"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
            <div
              className="relative z-10 max-w-2xl w-full rounded-2xl bg-white p-6 sm:p-8 shadow-2xl transform transition-all scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={active.avatar} alt={active.name} className="w-16 h-16 rounded-full ring-2 ring-green-100 shadow-sm" />
                  <div>
                    <div className="font-semibold text-lg text-gray-900">{active.name}</div>
                    <div className="text-sm text-gray-500">{active.title}</div>
                  </div>
                </div>
                <button onClick={() => setActive(null)} className="text-gray-400 hover:text-gray-700 p-2 rounded-md focus:outline-none">
                  Close
                </button>
              </div>

              <div className="mt-6 text-gray-700 leading-relaxed text-lg">
                {active.quote}
              </div>

              <div className="mt-6 flex items-center justify-end">
                <img src={active.logo} alt="" className="h-8 opacity-80"/>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Testimonials