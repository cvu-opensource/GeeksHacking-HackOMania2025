import Link from "next/link"
import { useUser } from "../contexts/UserContext"

export function Navigation() {
  const { isLoggedIn } = useUser()

  return (
    <nav className="bg-[#D2B48C] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {isLoggedIn ? (
          <Link href="/home" className="text-2xl font-bold text-[#2D3748] hover:text-[#4A5568]">
            GeekedIn
          </Link>
        ) : (
          <Link href="/" className="text-2xl font-bold text-[#2D3748] hover:text-[#4A5568]">
            GeekedIn
          </Link>
        )}
        <div className="space-x-4">
          <Link href="/home" className="text-[#2D3748] hover:text-[#4A5568]">
            Home
          </Link>
          <Link href="/events" className="text-[#2D3748] hover:text-[#4A5568]">
            Events
          </Link>
          <Link href="/forums" className="text-[#2D3748] hover:text-[#4A5568]">
            Forums
          </Link>
          <Link href="/profile" className="text-[#2D3748] hover:text-[#4A5568]">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}

