import { useContent } from '../hooks/useContent'

// החליפי את הנתיב לסרטון שלך לאחר שהעלית לתיקיית public/
const BANNER_VIDEO = '/banner-video.mp4.mp4'

export default function Hero() {
  const { content } = useContent()

  return (
    <section id="home">

      {/* ── Banner ── */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh] overflow-hidden bg-cream-200">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={BANNER_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 sm:pb-14 px-4 text-center">
          <p className="text-cream-200 text-[11px] sm:text-xs tracking-[0.4em] font-light mb-3 uppercase">
            בוטיק אישי &nbsp;·&nbsp; יד שניה &nbsp;·&nbsp; אופנה מתחדשת
          </p>
          <h1 className="font-frank text-5xl sm:text-6xl md:text-7xl font-light text-white leading-tight mb-4 drop-shadow-lg">
            הארון של יעל
          </h1>
          <p className="text-cream-200 text-base sm:text-xl font-light mb-7 drop-shadow">
            {content.bannerSubtitle}
          </p>
          <button
            onClick={() => document.getElementById('items')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center gap-2 bg-white text-charcoal px-8 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:bg-cream-200 hover:shadow-lg shadow-md"
          >
            {content.bannerCta}
          </button>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2" aria-hidden>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </div>

      {/* ── Story & stats ── */}
      <div className="bg-cream-100 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-14 bg-taupe-300" />
            <span className="text-taupe-400">✦</span>
            <div className="h-px w-14 bg-taupe-300" />
          </div>

          <div id="about" className="text-warm-gray font-light leading-8 text-sm sm:text-base mb-10">
            {content.story.map((para, i) => (
              <p key={i} className={i > 0 ? 'mt-3' : ''}>{para}</p>
            ))}
            {content.storyQuote && (
              <>
                <p className="mt-3 text-taupe-500 font-medium">{content.storyQuote}</p>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <div className="h-px w-14 bg-taupe-300" />
                  <span className="text-taupe-400">✦</span>
                  <div className="h-px w-14 bg-taupe-300" />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center gap-10 sm:gap-20">
            {content.stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-frank text-3xl text-charcoal">{value}</div>
                <div className="text-xs text-warm-gray mt-1 tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
