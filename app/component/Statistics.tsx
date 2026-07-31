"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
    { label: "Donors", target: 1000 },
    { label: "Lives Saved", target: 500 },
    { label: "Hospitals", target: 20 },
];

function Counter({ target }: { target: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLHeadingElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const duration = 1500;
                    const startTime = performance.now();

                    const animate = (now: number) => {
                        const progress = Math.min((now - startTime) / duration, 1);
                        setCount(Math.floor(progress * target));
                        if (progress < 1) requestAnimationFrame(animate);
                        else setCount(target);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [target]);

    return (
        <h2 ref={ref} className="text-4xl md:text-5xl font-bold text-red-600">
            {count.toLocaleString()}+
        </h2>
    );
}

export default function Statistics() {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-16 px-6 text-center bg-white">
            {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2">
                    <Counter target={stat.target} />
                    <p className="text-gray-600 font-medium tracking-wide uppercase text-sm">
                        {stat.label}
                    </p>
                </div>
            ))}
        </section>
    );
}