import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-900 via-purple-800 to-blue-900 text-white">
      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-7xl font-bold tracking-tight">
            Takes<span className="text-primaryContent">Avenue</span>
          </h1>
          <p className="text-2xl text-gray-300">
            Share your fun take on anything and get rewarded for it 
          </p>
          
          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: 'Share your take',
                desc: 'Express yourself freely',
                icon: '💬'
              },
              {
                title: 'Earn $TKE Tokens',
                desc: 'Get rewarded for engagement',
                icon: '🎯'
              },
              {
                title: 'Build Community',
                desc: 'Connect with like minds',
                icon: '🤝'
              }
            ].map((item) => (
              <div key={item.title} className="backdrop-blur-sm bg-white/10 rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 space-x-4">
            <Link href={"https://github.com/ANTONINEUTRON/takesavenue_webapp/releases/tag/TakesAvenue_v0.5-beta"} className="bg-primaryContent text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-400 transition-all">
              
                Download App
            </Link>
            <button className="border-2 border-primaryCbg-primaryContent text-primaryCbg-primaryContent px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-400/10 transition-all">
              Join Waitlist
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
