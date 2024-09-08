"use client";

import React from "react";
import Image from "next/image";

interface icons {
    label: string;
    sourcePath: string;
}



export default function LogoCarousel({ icons }: { icons: icons[] }) {
    return (
        <div className="py-[30px]">
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-16  z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 b z-10"></div>
                <div className="overflow-hidden">
                    <div className="flex animate-infinite-scroll">
                        {icons.concat(icons).map((icon, index) => (
                            <div
                                key={`${icon.label}-${index}`}
                                className="flex-none mx-4 sm:mx-6 md:mx-8 w-[100px] sm:w-[150px] md:w-[200px]"
                            >
                                <div className="h-12 sm:h-16 w-full flex items-center justify-center">
                                    <Image
                                        src={icon.sourcePath}
                                        alt={icon.label}
                                        width={250}
                                        height={250}
                                        className="max-h-[24px] sm:max-h-[32px] md:max-h-[80px] object-contain "
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
