import Link from "next/link";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/shared/NavBar";
import { CloudCogIcon, CloudIcon, GitlabIcon, LinkedinIcon, NetworkIcon, SignalMediumIcon, TwitterIcon, CheckIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#e6fcf5]">
      <NavBar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0ca678] to-[#12b886] text-white pb-32">
          <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
            <div className="relative z-10 grid gap-6 sm:gap-10 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Scalable Video Processing with Azure
                </h1>
                <p className="text-lg sm:text-xl">Unlock the power of cloud-based video processing</p>
                <div>
                  <Link
                    href="#"
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
                    src="/placeholder.svg?height=600&width=600"
                    width={600}
                    height={600}
                    alt="Hero"
                    className="mx-auto h-full w-full max-w-[400px] rounded-lg object-cover shadow-2xl transition-transform hover:scale-105"
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
                  src="/placeholder.svg?height=400&width=600"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-12">
            {[
              { icon: CloudIcon, label: "Azure" },
              { icon: SignalMediumIcon, label: "Media Services" },
              { icon: CloudCogIcon, label: "Cognitive Services" },
              { icon: NetworkIcon, label: "Content Delivery Network" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="bg-white rounded-full p-4 shadow-lg transition-all hover:scale-110">
                  <item.icon className="h-8 w-8 text-[#0ca678]" />
                </div>
                <p className="text-[#12b886]">{item.label}</p>
              </div>
            ))}
          </div>
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
            <img
              src="/placeholder.svg?height=300&width=1270"
              width={1270}
              height={300}
              alt="Workflow"
              className="mx-auto aspect-[3/1] overflow-hidden rounded-xl object-cover shadow-2xl transition-transform hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-[12px] left-0 right-0 h-32 bg-[#e6fcf5]" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)" }}></div>
        </section>
        <section className="py-20 sm:py-32 px-4 md:px-6 lg:px-8 bg-[#e6fcf5] relative">
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <img
                src="/placeholder.svg?height=300&width=300"
                width={300}
                height={300}
                alt="Creator"
                className="w-full max-w-[200px] sm:max-w-[300px] rounded-full shadow-2xl transition-transform hover:scale-105"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0ca678]">About the Creator</h2>
              <p className="text-lg sm:text-xl md:text-2xl text-[#12b886]">
                Meet the mind behind the Scalable Video Processing with Azure solution.
              </p>
              <p className="text-[#0ca678]">
                John Doe is a seasoned cloud architect with a passion for building scalable and efficient video processing
                solutions. With years of experience in Azure and media technologies, he has developed this cutting-edge
                platform to empower businesses to effortlessly manage and deliver their video content.
              </p>
              <div className="flex gap-4">
                {[TwitterIcon, LinkedinIcon, GitlabIcon].map((Icon, index) => (
                  <Link key={index} href="#" className="text-[#0ca678] hover:text-[#12b886] transition-colors">
                    <Icon className="h-6 w-6" />
                  </Link>
                ))}
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
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#0ca678] transition-all hover:scale-105">Contact Us</Button>
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