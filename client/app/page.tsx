import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="w-full bg-primary text-primary-foreground py-4 px-6 md:px-12">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="text-lg font-bold">Video Processing</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#"
              className="text-sm font-medium hover:underline"
              prefetch={false}
            >
              How It Works
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:underline"
              prefetch={false}
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:underline"
              prefetch={false}
            >
              Benefits
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:underline"
              prefetch={false}
            >
              Technology
            </Link>
            <SignedIn>
              <Button variant="secondary">Get Started</Button>
              <UserButton />
              <SignOutButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </nav>
          <Button variant="outline" size="icon" className="md:hidden">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Scalable Video Processing with Azure
                </h1>
                <p className="mt-4 text-muted-foreground text-lg">
                  Efficiently process videos at scale with our Azure-powered
                  solution. Automate your video workflows and focus on
                  delivering great content.
                </p>
                <div className="mt-6 flex gap-2">
                  <SignedIn>
                    <Link
                      className={buttonVariants({ variant: null })}
                      href="/Dashboard"
                    >
                      Get Started
                    </Link>
                  </SignedIn>
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                  <Button variant="secondary">Learn More</Button>
                </div>
              </div>
              <div className="md:justify-self-end">
                <img
                  src="/placeholder.svg"
                  width="600"
                  height="400"
                  alt="Video Processing"
                  className="rounded-xl"
                  style={{ aspectRatio: "600/400", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="/placeholder.svg"
                  width="600"
                  height="400"
                  alt="How It Works"
                  className="rounded-xl"
                  style={{ aspectRatio: "600/400", objectFit: "cover" }}
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  How It Works
                </h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  Our scalable video processing solution leverages Azure
                  services to automate your video workflows:
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Detect New Videos</h3>
                      <p className="text-muted-foreground">
                        New videos are detected in Azure Storage Queue and added
                        to the processing queue.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Process Videos</h3>
                      <p className="text-muted-foreground">
                        Videos are processed in Azure Container Instances,
                        leveraging the power of the cloud.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Store Results</h3>
                      <p className="text-muted-foreground">
                        Processed videos are uploaded to Azure Blob Storage for
                        easy access and distribution.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Key Features
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Our video processing solution offers powerful features to
                streamline your workflows.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-muted rounded-lg p-6 shadow-sm">
                <BoltIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-xl font-medium">
                  Scalable Processing
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Automatically scale up or down to handle any volume of videos,
                  ensuring efficient processing.
                </p>
              </div>
              <div className="bg-muted rounded-lg p-6 shadow-sm">
                <GaugeIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-xl font-medium">Rapid Turnaround</h3>
                <p className="mt-2 text-muted-foreground">
                  Process videos quickly, reducing the time it takes to get your
                  content online and available.
                </p>
              </div>
              <div className="bg-muted rounded-lg p-6 shadow-sm">
                <BotIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-xl font-medium">
                  Automated Workflows
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Streamline your video processing with automated workflows,
                  reducing manual effort and errors.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="benefits" className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Benefits
                </h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  Our video processing solution offers a range of benefits to
                  help you save time and money.
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Cost-Effective</h3>
                      <p className="text-muted-foreground">
                        Pay only for the resources you use, with no upfront
                        costs or long-term commitments.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Reduced Manual Effort</h3>
                      <p className="text-muted-foreground">
                        Automate your video processing workflows, freeing up
                        your team to focus on more strategic tasks.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Faster Processing</h3>
                      <p className="text-muted-foreground">
                        Leverage the power of the cloud to process videos
                        quickly, reducing the time to market.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="md:justify-self-end">
                <img
                  src="/placeholder.svg"
                  width="600"
                  height="400"
                  alt="Benefits"
                  className="rounded-xl"
                  style={{ aspectRatio: "600/400", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="technology" className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Technology Stack
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Our video processing solution is powered by the following Azure
                services:
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-muted rounded-lg p-6 shadow-sm">
                <StoreIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-xl font-medium">
                  Azure Storage Queue
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Detect new videos and add them to the processing queue.
                </p>
              </div>
              <div className="bg-muted rounded-lg p-6 shadow-sm">
                <ContainerIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-xl font-medium">
                  Azure Container Instances
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Process videos at scale using the power of the cloud.
                </p>
              </div>
              <div className="bg-muted rounded-lg p-6 shadow-sm">
                <BoxIcon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-xl font-medium">Azure Blob Storage</h3>
                <p className="mt-2 text-muted-foreground">
                  Store the processed videos for easy access and distribution.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg">
              Learn more about our scalable video processing solution or get in
              touch to discuss your needs.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="secondary">Learn More</Button>
              <Button variant="outline">Contact Us</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6 px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 Video Processing. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function BoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ContainerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z" />
      <path d="M10 21.9V14L2.1 9.1" />
      <path d="m10 14 11.9-6.9" />
      <path d="M14 19.8v-8.1" />
      <path d="M18 17.5V9.4" />
    </svg>
  );
}

function GaugeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function StoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  );
}
