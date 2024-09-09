'use client'

import { useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import NavBar from "@/components/shared/NavBar"
import Marquee from "@/components/ui/marquee"
import { AlertCircle, CheckIcon, Key, Upload } from "lucide-react"
import { motion } from 'framer-motion'
import { SignedIn, SignedOut } from '@clerk/nextjs'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function Home() {
  useEffect(() => {
    document.body.style.scrollBehavior = 'smooth'
    return () => {
      document.body.style.scrollBehavior = 'auto'
    }
  }, [])

  const icons = [
    { label: "Azure", sourcePath: "/assets/Microsoft_Azure.svg" },
    { label: "Next.js", sourcePath: "/assets/Nextjs-logo.svg" },
    { label: "TypeScript", sourcePath: "/assets/ts-logo-256.svg" },
    { label: "NodeJs", sourcePath: "/assets/nodejsStackedDark.svg" },
    { label: "Prisma", sourcePath: "/assets/Prisma-IndigoLogo.svg" },
    { label: "PostgreSQL", sourcePath: "/assets/postgresql-ar21.svg" },
    { label: "Docker", sourcePath: "/assets/docker-logo-blue.svg" },
    { label: "ClerkJs", sourcePath: "/assets/clerk-logo-dark-accent.svg" },
    { label: "Pusher", sourcePath: "/assets/pusher-logo-0576fd4af5c38706f96f632235f3124a.svg" },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-[#e6fcf5] to-white">
      <NavBar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0ca678] to-[#12b886] text-white py-20 sm:py-32">
          <motion.div className="container mx-auto px-4" {...fadeIn}>
            <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Scalable Video Processing with Microsoft Azure
                </h1>
                <p className="text-xl sm:text-2xl">Unlock the power of cloud-based video processing</p>
                <Link
                  href="/Dashboard"
                  className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-lg font-medium text-[#0ca678] shadow-lg transition-all hover:bg-[#e6fcf5] hover:text-[#12b886] focus:outline-none focus:ring-2 focus:ring-[#12b886] focus:ring-offset-2 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0ca678] to-[#12b886] opacity-50 blur-3xl animate-pulse" />
                <Image
                  src="/assets/HeaderSection.png"
                  width={1200}
                  height={1200}
                  alt="Hero"
                  className="rounded-lg  transition-transform hover:scale-105"
                />
              </div>
            </div>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#e6fcf5]" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}></div>
        </section>

        <section id="how-it-works" className="py-20 sm:py-32 bg-[#e6fcf5] relative">
          <motion.div className="container mx-auto px-4" {...fadeIn}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/assets/heroSection-1.png"
                  width={600}
                  height={400}
                  alt="How It Works"
                  className="rounded-xl shadow-2xl transition-transform hover:scale-105"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0ca678] mb-6">
                  How It Works
                </h2>
                <p className="text-[#12b886] text-xl mb-8">
                  Our scalable video processing solution leverages Azure
                  services to automate your video workflows:
                </p>
                <ul className="space-y-6">
                  {["Detect New Videos", "Process Videos", "Store Results"].map((item, index) => (
                    <motion.li key={index} className="flex items-start gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 }}>
                      <div className="bg-[#0ca678] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                        <CheckIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#0ca678] text-xl mb-2">{item}</h3>
                        <p className="text-[#12b886]">
                          {item === "Detect New Videos" && "New videos are detected in Azure Storage Queue and added to the processing queue."}
                          {item === "Process Videos" && "Videos are processed in Azure Container Instances, leveraging the power of the cloud."}
                          {item === "Store Results" && "Processed videos are uploaded to Azure Blob Storage for easy access and distribution."}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-white" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)" }}></div>
        </section>

        <section className="bg-white py-20 sm:py-32 px-4 md:px-6 lg:px-8 text-[#0ca678] relative">
          <motion.div className="max-w-3xl mx-auto text-center space-y-6" {...fadeIn}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Tech Stack</h2>
            <p className="text-xl sm:text-2xl text-[#12b886]">
              Powered by the latest Azure technologies.
            </p>
          </motion.div>
          <Marquee icons={icons} />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#e6fcf5]" style={{ clipPath: "polygon(0 0, 100% 100%, 100% 100%, 0 100%)" }}></div>
        </section>

        <section className="w-full py-20 sm:py-32 bg-[#e6fcf5] relative">
          <motion.div className="container px-4 md:px-6 flex flex-col items-center justify-center space-y-10" {...fadeIn}>
            <div className="space-y-4 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0ca678]">Workflow</h2>
              <p className="max-w-[600px] text-[#12b886] text-xl">
                Streamline your video processing workflow with our cloud-based solution.
              </p>
            </div>
            <div className="w-full max-w-6xl mx-auto">
              <div className="relative aspect-[3548/1594] bg-white rounded-[2rem] shadow-2xl p-4 overflow-hidden">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-200 rounded-full"></div>
                <div className="absolute inset-4 bg-[#e6fcf5] rounded-[1.75rem] overflow-hidden">
                  <Image
                    src="/assets/workflow.png"
                    alt="Workflow"
                    width={3548}
                    height={1594}
                    className="transition-transform hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-white" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)" }}></div>
        </section>

        <section className="py-20 sm:py-32 bg-white relative">
          <motion.div className="container mx-auto px-4" {...fadeIn}>
            <h2 className="text-4xl font-bold text-center mb-12 text-[#0ca678]">Upload Limits</h2>
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#e6fcf5] to-white rounded-xl overflow-hidden shadow-2xl">
              <div className="md:flex">
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-6">
                    <AlertCircle className="h-8 w-8 text-[#0ca678] mr-3" />
                    <h3 className="text-2xl font-semibold text-[#0ca678]">New Account</h3>
                  </div>
                  <ul className="space-y-4 text-[#12b886] mb-8">
                    <li className="flex items-center">
                      <Upload className="h-5 w-5 mr-3" />
                      1 video (max 50MB)
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-3" />
                      Deleted after 24 hours
                    </li>
                  </ul>
                  <SignedIn>   <Link
                    href="/Dashboard"
                    className="inline-block w-full bg-[#0ca678] hover:bg-[#12b886] text-white text-lg py-2 px-4 rounded-md text-center transition-colors duration-200 ease-in-out"
                  >
                    Dashboard
                  </Link></SignedIn>
                  <SignedOut>
                    <Link
                      href="/sign-up"
                      className="inline-block w-full bg-[#0ca678] hover:bg-[#12b886] text-white text-lg py-2 px-4 rounded-md text-center transition-colors duration-200 ease-in-out"
                    >
                      Register Now
                    </Link>
                  </SignedOut>

                </div>
                <div className="md:w-1/2 p-8 bg-gradient-to-br from-[#0ca678] to-[#12b886] text-white">
                  <div className="flex items-center mb-6">
                    <Key className="h-8 w-8 mr-3" />
                    <h3 className="text-2xl font-semibold">With API Key</h3>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center">
                      <Upload className="h-5 w-5 mr-3" />
                      Up to 3 videos (50MB each)
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-3" />
                      Deleted after 24 hours
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-white text-[#0ca678] hover:bg-[#e6fcf5] text-lg py-3"
                  >
                    Get API Key
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#e6fcf5]" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)" }}></div>
        </section>

        <section className="py-20 sm:py-32 px-4 md:px-6 lg:px-8 bg-[#e6fcf5] relative">
          <motion.div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 items-center" {...fadeIn}>
            <div className="flex justify-center">
              <Image
                src="https://avatars.githubusercontent.com/u/93467074?s=400&u=ee87a4ccafbf6192b3ad643c73bc6a2d50b13c19&v=4"
                width={300}
                height={300}
                alt="Creator"
                className="rounded-full shadow-2xl transition-transform hover:scale-105"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0ca678]">About the Creator</h2>
              <p className="text-xl text-[#12b886]">
                Meet the mind behind the Scalable Video Processing with Azure solution.
              </p>
              <p className="text-[#0ca678] text-lg">
                Vinayak Vispute is a skilled software engineer with a strong focus on building innovative AI-powered applications. With expertise in cloud solutions, web development, and media processing, he is dedicated to creating seamless, intelligent platforms that transform user experiences and streamline complex workflows.
              </p>
              <div className="flex gap-6">
                <Link href="https://github.com/VinayakVispute" className="text-[#0ca678] hover:text-[#12b886] transition-colors">
                  <Image src="/assets/github-mark.svg" width={38} height={38} alt="github-vinayak" />
                </Link>
                <Link href="https://x.com/VinayakVispute7" className="text-[#0ca678] hover:text-[#12b886] transition-colors">
                  <Image src="/assets/twitter.png" width={38} height={38} alt="twitter-vinayak" />
                </Link>
                <Link href="" className="text-[#0ca678] hover:text-[#12b886] transition-colors">
                  <Image src="/assets/In-Blue-96.png" width={38} height={38} alt="linkedin-vinayak" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="py-20 sm:py-32 bg-gradient-to-br from-[#0ca678] to-[#12b886] text-white relative">
          <motion.div className="container mx-auto px-4 md:px-6 text-center" {...fadeIn}>
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8">
              Learn more about our scalable video processing solution or get in
              touch to discuss your needs.
            </p>
            <div className="flex justify-center gap-6">
              <Button className="bg-white text-[#0ca678] hover:bg-[#e6fcf5] hover:text-[#12b886] text-lg py-3 px-6 transition-all hover:scale-105">Learn More</Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#0ca678] text-lg py-3 px-6 transition-all hover:scale-105">Contact Us</Button>
            </div>
          </motion.div>
          <div className="absolute top-0 left-0 right-0 h-32 bg-[#e6fcf5]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)" }}></div>
        </section>
      </main>
      <footer className="bg-[#0ca678] py-8 px-4 md:px-6 text-white">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm mb-4 sm:mb-0">
            &copy; 2024 Video Processing. All rights reserved.
          </p>
          <nav className="flex items-center gap-6">
            <Link href="#" className="text-sm hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}