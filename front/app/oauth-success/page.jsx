import { Suspense } from 'react'
import OAuthClientSuccess from './OAuthClientSuccess'

export default function OAuthSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthClientSuccess />
    </Suspense>
  )
}

