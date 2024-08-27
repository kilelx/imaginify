import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

function Home() {
  return (
    <div>
      <p>Home</p>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
export default Home;