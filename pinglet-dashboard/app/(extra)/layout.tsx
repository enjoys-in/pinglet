import React from 'react'
import Header from '../_components/header'
import Footer from '../_components/footer'

const layout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex min-h-[100dvh] flex-col">
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default layout