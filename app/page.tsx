export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col text-center">
        <h1 className="text-6xl font-bold mb-4">Bloom Time</h1>
        <p className="text-xl text-gray-600 mb-8">种下时间，收获花园</p>
        <a 
          href="/schedule"
          className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          开始打卡
        </a>
      </div>
    </main>
  );
}