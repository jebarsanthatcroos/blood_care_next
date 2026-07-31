import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="bg-red-600 text-white py-16 px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Be Someone&apos;s Hero Today
            </h2>
            <p className="text-lg text-red-100 max-w-xl mx-auto mb-8">
                Every blood donor is a life saver.
                Your contribution can make a difference.
            </p>
            <Link
                href="/contact"
                className="inline-block bg-white text-red-600 font-semibold px-6 py-3 rounded-full hover:bg-red-100 transition-colors"
            >
                Contact Us
            </Link>
        </section>
    );
}