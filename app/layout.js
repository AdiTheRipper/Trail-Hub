import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Sahyadri Trail Hub',
  description: 'Track your treks, earn badges, and explore Maharashtra\'s forts and trails with the Sahyadri hiking community.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
