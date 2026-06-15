import EmptyState from '@/components/EmptyState/EmptyState'
import Button from '@/components/Button/Button'
import ProfileIcon from 'assets/profile-icon.svg'

interface Props {
  title: string
  className?: string
}

export default function LoginCTA({ title, className }: Props) {
  return (
    <EmptyState title={title} className={className}>
      <Button href="/login">
        <ProfileIcon />
        Sign in
      </Button>
    </EmptyState>
  )
}
