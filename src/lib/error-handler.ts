import { NextResponse } from 'next/server'

export function handleApiError(error: unknown, context: string) {
  console.error(`${context} error:`, error)
  
  // Check if it's a Prisma error
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any
    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json(
          { message: 'Unique constraint failed' },
          { status: 400 }
        )
      case 'P2025':
        return NextResponse.json(
          { message: 'Record not found' },
          { status: 404 }
        )
      default:
        return NextResponse.json(
          { message: 'Database error' },
          { status: 500 }
        )
    }
  }
  
  // Check if it's a network/connection error
  if (error instanceof Error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return NextResponse.json(
        { message: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }
  }
  
  // Generic error
  return NextResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  )
}
