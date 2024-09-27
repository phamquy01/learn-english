import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="px-10 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-center my-20">
          Welcome to Translate
        </h1>
        <button className="w-[200px] h-[50px] border-solid border-2 border-indigo-600 rounded-md bg-indigo-600 text-[#fff]">
          <Link href="/translate">Translate now</Link>
        </button>
      </div>
    </main>
  );
}
