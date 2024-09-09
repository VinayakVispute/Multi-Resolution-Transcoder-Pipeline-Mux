'use client'

import { useState, useEffect } from 'react'
import { Key, ShieldCheck, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { checkUserAPIKey } from '@/lib/action/user.actions'
import { useAuth } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function PolicyPage() {
    const [hasApiKey, setHasApiKey] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { userId, isSignedIn, isLoaded } = useAuth()

    useEffect(() => {
        const checkApiKey = async () => {
            if (!userId || !isSignedIn) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const response = await checkUserAPIKey(userId)
                setHasApiKey(response.success)
            } catch (err) {
                setError('Failed to check API key status. Please try again later.')
                console.error('Error checking API key:', err)
            } finally {
                setIsLoading(false)
            }
        }

        if (isLoaded) {
            checkApiKey()
        }

        return () => {
            setHasApiKey(null)
            setError(null)
        }
    }, [userId, isSignedIn, isLoaded])

    const policies = {
        newAccount: [
            "1 video (max 50MB)",
            "Deleted after 24 hours",
            "Limited processing options",
        ],
        withApiKey: [
            "Up to 3 videos (50MB each)",
            "Deleted after 24 hours",
            "Full range of processing options",
            "Priority support",
        ]
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.5 }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#e6fcf5] to-white py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-3xl mx-auto space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0ca678]">Account Policies</h1>
                    <p className="mt-2 text-xl text-[#12b886]">Review your account status and policies</p>
                </div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="loading" {...fadeInUp} className="flex justify-center items-center h-32">
                            <Loader2 className="h-8 w-8 text-[#0ca678] animate-spin" />
                        </motion.div>
                    ) : error ? (
                        <motion.div key="error" {...fadeInUp} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </motion.div>
                    ) : (
                        <motion.div key="content" {...fadeInUp} className="space-y-8">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-[#0ca678] mb-4 flex items-center">
                                    <Key className="h-6 w-6 mr-2" />
                                    API Key Status
                                </h2>
                                <div className="flex items-center space-x-2">
                                    {hasApiKey ? (
                                        <>
                                            <CheckCircle className="h-6 w-6 text-green-500" />
                                            <span className="text-lg text-green-700">API Key is set</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-6 w-6 text-red-500" />
                                            <span className="text-lg text-red-700">No API Key set</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-[#0ca678] mb-4 flex items-center">
                                    <ShieldCheck className="h-6 w-6 mr-2" />
                                    Account Policies
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {['newAccount', 'withApiKey'].map((accountType) => (
                                        <div key={accountType}>
                                            <h3 className="text-xl font-semibold text-[#12b886] mb-3">
                                                {accountType === 'newAccount' ? 'New Account' : 'With API Key'}
                                            </h3>
                                            <ul className="space-y-2">
                                                {policies[accountType as keyof typeof policies].map((policy, index) => (
                                                    <motion.li
                                                        key={index}
                                                        className="flex items-start"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#e6fcf5] flex items-center justify-center mr-2">
                                                            <span className="text-[#0ca678] text-xs font-semibold">{index + 1}</span>
                                                        </span>
                                                        <span className="text-gray-700">{policy}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <p className="text-gray-600">
                                    For any questions or to upgrade your account, please contact support.
                                </p>
                                <Button asChild className="bg-[#0ca678] hover:bg-[#12b886] text-white">
                                    <Link href="/contact">Contact Support</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}