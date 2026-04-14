import type React from 'react'

export const PageContainer: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return (
        <main className="flex w-full grow flex-col items-center">
            {children}
        </main>
    )
}
