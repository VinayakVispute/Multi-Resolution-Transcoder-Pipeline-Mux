import Link from "next/link";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/shared/NavBar";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import Marquee from "@/components/ui/marquee";


export default function Home() {

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
    <div className="flex min-h-[100dvh] flex-col bg-[#e6fcf5]">
      <NavBar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0ca678] to-[#12b886] text-white pb-32">
          <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
            <div className="relative z-10 grid gap-6 sm:gap-10 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Scalable Video Processing with Microsoft Azure
                </h1>
                <p className="text-lg sm:text-xl">Unlock the power of cloud-based video processing</p>
                <div>
                  <Link
                    href="/Dashboard"
                    className="inline-flex items-center justify-center rounded-md bg-[#ff6b6b] px-5 py-3 text-base font-medium text-white shadow-lg transition-all hover:bg-[#fa5252] focus:outline-none focus:ring-2 focus:ring-[#ff8787] focus:ring-offset-2 hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0ca678] to-[#12b886] opacity-50 blur-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0ca678] to-[#12b886] opacity-50 blur-3xl animate-pulse" />
                </div>
                <div className="relative">
                  <img
                    src="/assets/HeaderSection.png"
                    width={1200}
                    height={1200}
                    alt="Hero"
                    className="mx-auto h-full w-full rounded-lg object-cover  transition-transform hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}></div>
        </section>
        <section id="how-it-works" className="py-12 md:py-24 lg:py-32 bg-white relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="/assets/heroSection-1.png"
                  width={600}
                  height={400}
                  alt="How It Works"
                  className="rounded-xl shadow-2xl transition-transform hover:scale-105"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0ca678]">
                  How It Works
                </h2>
                <p className="mt-4 text-[#12b886] text-lg">
                  Our scalable video processing solution leverages Azure
                  services to automate your video workflows:
                </p>
                <ul className="mt-6 space-y-4">
                  {["Detect New Videos", "Process Videos", "Store Results"].map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="bg-[#0ca678] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                        <CheckIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#0ca678]">{item}</h3>
                        <p className="text-[#12b886]">
                          {item === "Detect New Videos" && "New videos are detected in Azure Storage Queue and added to the processing queue."}
                          {item === "Process Videos" && "Videos are processed in Azure Container Instances, leveraging the power of the cloud."}
                          {item === "Store Results" && "Processed videos are uploaded to Azure Blob Storage for easy access and distribution."}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#e6fcf5]" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)" }}></div>
        </section>
        <section className="bg-[#e6fcf5] py-20 sm:py-32 px-4 md:px-6 lg:px-8 text-[#0ca678] relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Tech Stack</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-[#12b886]">
              Powered by the latest Azure technologies.
            </p>
          </div>
          <Marquee icons={icons} />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-white" style={{ clipPath: "polygon(0 0, 100% 100%, 100% 100%, 0 100%)" }}></div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white relative">
          <div className="container px-4 md:px-6 flex flex-col items-center justify-center space-y-6 md:space-y-10">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#0ca678]">Workflow</h2>
              <p className="max-w-[600px] text-[#12b886] md:text-xl">
                Streamline your video processing workflow with our cloud-based solution.
              </p>
            </div>
            <div className="container mx-auto px-4 my-8">
              <div className="relative w-full max-w-6xl mx-auto aspect-[3548/1594] bg-gray-200 rounded-[2rem] shadow-2xl p-4 overflow-hidden">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-400 rounded-full"></div>
                <div className="absolute inset-4 bg-white rounded-[1.75rem] overflow-hidden">
                  <div className="relative w-full h-full">
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
            </div>
          </div>
          <div
            className="absolute -bottom-[12px] left-0 right-0 h-32 bg-[#e6fcf5]"
            style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)" }}
          ></div>
        </section>
        <section className="py-20 sm:py-32 px-4 md:px-6 lg:px-8 bg-[#e6fcf5] relative">
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <Image
                src="https://avatars.githubusercontent.com/u/93467074?s=400&u=ee87a4ccafbf6192b3ad643c73bc6a2d50b13c19&v=4"
                width={300}
                height={300}
                alt="Creator"
                className="w-full  rounded-full shadow-2xl transition-transform hover:scale-105"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0ca678]">About the Creator</h2>
              <p className="text-lg sm:text-xl md:text-2xl text-[#12b886]">
                Meet the mind behind the Scalable Video Processing with Azure solution.
              </p>
              <p className="text-[#0ca678] text-justify">
                Vinayak Vispute is a skilled software engineer with a strong focus on building innovative AI-powered applications. With expertise in cloud solutions, web development, and media processing, he is dedicated to creating seamless, intelligent platforms that transform user experiences and streamline complex workflows.
              </p>
              <div className="flex gap-4">

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
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#0ca678] to-[#12b886] text-white relative">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg">
              Learn more about our scalable video processing solution or get in
              touch to discuss your needs.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button variant="secondary" className="bg-[#ff6b6b] text-white hover:bg-[#fa5252] transition-all hover:scale-105">Learn More</Button>
              <Button variant="outline" className="border-white text-green-800 hover:bg-white hover:text-[#0ca678] transition-all hover:scale-105">Contact Us</Button>
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-32 bg-[#e6fcf5]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)" }}></div>
        </section>
      </main>
      <footer className="bg-[#0ca678] py-6 px-4 md:px-6 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">
            &copy; 2024 Video Processing. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
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
  );
}