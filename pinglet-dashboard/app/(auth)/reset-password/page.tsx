import React, { Suspense } from 'react'
import { ResetPasswordPage } from './components/ResetPassword'
import PingletLoader from '@/components/loader/PingletLoader'

const page = () => {
    return (
        <Suspense fallback={<PingletLoader variant="component" message="Loading Reset Password..." />}><ResetPasswordPage /></Suspense>
    )
}

export default page