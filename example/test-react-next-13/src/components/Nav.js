import Link from 'next/link'

export default function Nav () {
  return (
        <>
            <Link href="csr" >Client side rendered page</Link>
            <Link href="scr" >Component server page</Link>
        </>
  )
}
