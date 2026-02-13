import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRouter } from '@/app/AppRouter'
import '@/app/styles/index.scss'

import { useThemeStore } from '@/shared/model/themeStore'

// Initialize theme before rendering to avoid flash
useThemeStore.getState().initTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>,
)
