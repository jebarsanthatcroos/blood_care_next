export default function Features() {
    const features = [
        {
            icon: "❤️",
            title: "Save Lives",
            description: "Your donation helps patients in emergencies.",
        },
        {
            icon: "🩺",
            title: "Health Benefits",
            description: "Regular donation supports healthy blood flow.",
        },
        {
            icon: "🤝",
            title: "Support Community",
            description: "Help hospitals and people in need.",
        },
    ];

    return (
        <section className="py-16 px-6 bg-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                Why Donate Blood?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <span className="text-4xl">{feature.icon}</span>
                        <h3 className="text-xl font-semibold text-gray-900">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}