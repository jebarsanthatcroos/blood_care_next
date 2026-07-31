import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="bg-red-50 py-20 px-6">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                    Donate Blood,<br /> Save Lives
                </h1>
                <p className="text-lg text-gray-600 max-w-xl">
                    A single donation can save up to three lives.
                    Join our mission and become a life saver today.
                </p>
                <Link
                    href="/about"
                    className="inline-block bg-red-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-red-700 transition-colors"
                >
                    Learn More
                </Link>
            </div>
        </section>
    );
}