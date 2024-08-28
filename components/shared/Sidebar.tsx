"use client"
import { navLinks } from "@/constants"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

function Sidebar() {

    // Get the current pathname to know if the link is active or not
    const pathname = usePathname();
  return (
    <aside className="sidebar">
        <div className="flex size-full flex-col gap-4">
            <Link href='/' className="sidebar-logo">
                <Image src='/assets/images/logo-text.svg' alt="logo" width={180} height={28} />
            </Link>

            <nav className="sidebar-nav">
                {/* Display it only if the user is signed in */}
                <SignedIn>
                    <ul className="sidebar-nav_elements">
                        {/* Display the first 6 links */}
                        {navLinks.slice(0, 6).map(link => {
                            const isActive = link.route === pathname
                            return (
                                <li key={link.route} className={`sidebar-nav_element group
                                    ${isActive ? "bg-purple-gradient text-white" : "text-gray-700"}`}>
                                    <Link className="sidebar-link" href={link.route}>
                                        <Image
                                            src={link.icon}
                                            alt="logo"
                                            width={24}
                                            height={24}
                                            className={`${isActive && 'brightness-200'}`}
                                        />
                                        {link.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Display the last three links, to the "administration part" */}
                    <ul>
                        {navLinks.slice(6).map(link => {
                            const isActive = link.route === pathname
                            return (
                                <li key={link.route} className={`sidebar-nav_element group
                                    ${isActive ? "bg-purple-gradient text-white" : "text-gray-700"}`}>
                                    <Link className="sidebar-link" href={link.route}>
                                        <Image
                                            src={link.icon}
                                            alt="logo"
                                            width={24}
                                            height={24}
                                            className={`${isActive && 'brightness-200'}`}
                                        />
                                        {link.label}
                                    </Link>
                                </li>
                            )
                        })}
                        <li className="flex-left cursor-pointer gap-2 p-4">
                            <UserButton showName/>
                        </li>
                    </ul>
                </SignedIn>

                <SignedOut>
                    {/* Import a button from shadcn */}
                    <Button asChild className="button bg-purple-gradient bg-cover">
                        <Link href="/sign-in">
                            Login
                        </Link>
                    </Button>
                </SignedOut>
            </nav>
        </div>
    </aside>
  )
}
export default Sidebar