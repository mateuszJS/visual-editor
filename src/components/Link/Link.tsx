// eslint-disable-next-line no-restricted-imports
import NextLink from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

function getIsIOSDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

const isIOSDevice = getIsIOSDevice()

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

export default function Link(props: Props) {
  const router = useRouter()
  const pathname = usePathname()

  if (isIOSDevice) {
    return (
      <button
        className={props.className}
        style={props.style}
        onClick={() => router.push(props.href)}
        aria-current={pathname === props.href ? 'page' : undefined}
      >
        {props.children}
      </button>
    )
  }

  return <NextLink {...props} />
}
