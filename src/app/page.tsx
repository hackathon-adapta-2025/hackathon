'use client'

import { generateMyMission } from '@/actions/users'
import { Button } from '@/components/ui/button'
import { analyzeImage } from '@/models/ai'
import { useState } from 'react'

export default function Home() {
  const [result, setResult] = useState<string>('')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Button
       
      >
        aa
      </Button>

      {result && <pre className="mt-4 p-4 rounded">{result}</pre>}
    </div>
  )
}
