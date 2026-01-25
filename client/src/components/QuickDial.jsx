import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const QuickDial = () => {
    const contacts = [
        { name: "Police", number: "100", color: "bg-blue-600" },
        { name: "Fire", number: "101", color: "bg-orange-600" },
        { name: "Ambulance", number: "102", color: "bg-red-600" },
    ];

    return (
        <div className="flex gap-3 my-4 overflow-x-auto pb-2">
            {contacts.map((c) => (
                <a
                    key={c.name}
                    href={`tel:${c.number}`}
                    className={`flex-1 min-w-[100px] ${c.color} text-white p-3 rounded-xl flex flex-col items-center justify-center shadow-lg hover:brightness-110 transition`}
                >
                    <Phone size={20} className="mb-1" />
                    <span className="font-bold text-sm">{c.name}</span>
                    <span className="text-xs opacity-80">{c.number}</span>
                </a>
            ))}
        </div>
    );
};

export default QuickDial;
