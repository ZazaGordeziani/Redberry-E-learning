import type React from 'react'

export const PageContainer: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return (
        <main className="flex grow justify-center overflow-hidden">
            {children}{' '}
        </main>
    )
}

