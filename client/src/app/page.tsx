'use client';
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const route = useRouter();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button className="cursor-pointer"
        onClick={() => route.push('/login')}
      >Login</button>
      <button className="cursor-pointer"
        onClick={() => route.push('/signup')}
      >Sign Up</button>
      <button className="cursor-pointer"
        onClick={() => route.push('/allUsers')}
      >All Users</button>
      <Toaster
        position='bottom-right'
        reverseOrder={false}
        toastOptions={{
          success: { duration: 5000 },
          error: { duration: 5000 },
        }}
        containerStyle={{
          top: "6rem",
        }}
      />
    </div>
  );
}
