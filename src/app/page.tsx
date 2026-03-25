import Button from '@/components/Button/Button'
import Navigation from '@/components/Navigation/Navigation'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="page">
      <main>
        <h1>LOGO</h1>
        <section>Annoucement</section>
        <div>
          <h2>Recent Project</h2>
          <Link href="/projects">See all</Link>
          <ul>
            <li>
              Edited 2h ago
            </li>
          </ul>
          <h2>Recommended for you</h2>
          </div>

        <Button expand>Start a new Project</Button>
      </main>
      <Navigation />
    </div>
  )
}
