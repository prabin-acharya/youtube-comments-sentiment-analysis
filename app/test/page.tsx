"use client";

import Image from "next/image";

interface Video {
  title: string;
  videoId: string;
  thumbnail: string;
}

export default function Test() {
  return (
    <main className="flex flex-col items-center justify-center px-16 py-3">
      <h1>Test</h1>

      <div className="w-full h-0 relative pb-[56.25%] overflow-hidden">
        <Image
          src="https://i.ytimg.com/vi/tWYsfOSY9vY/hqdefault.jpg"
          alt="hello"
          //   className="border-2 border-red-400"
          //   width={500}
          //   height={400}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
      </div>
    </main>
  );
}
