import Button from '@/components/Button/Button'
import Navigation from '@/components/Navigation/Navigation'

export default function Home() {
  return (
    <div className="page">
      <main>
        <Button expand>Start a new Project</Button>
      </main>
      <Navigation />
    </div>
  )
}
