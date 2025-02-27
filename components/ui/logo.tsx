import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="FlowTechs Logo"
      width={150}
      height={40}
      priority
    />
  )
}

