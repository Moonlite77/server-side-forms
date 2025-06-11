import Image from "next/image";


export default function Home() {
  return (
<div className="min-h-screen bg-black text-white flex flex-col">

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-6xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-8">
            BE FOUND,
            <br />
            <span className="text-red-800 bg-white px-4">WITHOUT</span>
            <br />
            BEING SEEN
          </h1>

        </div>
      </main>

      {/* Bottom Section */}
      <section className="border-t-4 border-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-4 border-white p-6">
            <h3 className="text-2xl font-black mb-4">PRIVACY</h3>
            <p className="text-lg font-bold">Talent seekers NEVER get your contact information without your permission</p>
          </div>
          <div className="border-4 border-white p-6">
            <h3 className="text-2xl font-black mb-4">QUALITY</h3>
            <p className="text-lg font-bold">Talent seekers can find VERIFIED top quality candidates or speakers</p>
          </div>
          <div className="border-4 border-white p-6">
            <h3 className="text-2xl font-black mb-4">EQUITY</h3>
            <p className="text-lg font-bold">Talent seekers pay YOU for your time!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-white p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-lg font-black">© 2024 - ALL RIGHTS RESERVED</div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a
              href="#"
              className="text-lg font-bold hover:bg-white hover:text-black px-3 py-1 transition-colors duration-100"
            >
              TWITTER
            </a>
            <a
              href="#"
              className="text-lg font-bold hover:bg-white hover:text-black px-3 py-1 transition-colors duration-100"
            >
              GITHUB
            </a>
            <a
              href="#"
              className="text-lg font-bold hover:bg-white hover:text-black px-3 py-1 transition-colors duration-100"
            >
              EMAIL
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
