"use client"
import React from "react";
import Navbar from "@/components/shared/landing/Navbar";
import Hero from "@/components/shared/landing/Herosection";
import Testimonial from "@/components/shared/landing/Testinomial";
import CTA from "@/components/shared/landing/CTA";
import FAQ from "@/components/shared/landing/FAQs";
import Footer from "@/components/shared/landing/Footer";
import { Features } from "@/components/shared/landing/Featuer";

export default function Home() {
    return (
        <div>
            <Navbar />
            <Hero />
            <main className="min-h-screen m-10">
                <Features />
                <div className="my-10">
                    <CTA />
                </div>
                <Testimonial />
                <FAQ />
                <Footer />
            </main>
        </div>
    );
}
