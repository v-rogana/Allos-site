import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const adminPw = process.env.NEXT_PUBLIC_CERTIFICADOS_ADMIN_PASSWORD
    || process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  if (password === adminPw) {
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ success: false }, { status: 401 })
}
