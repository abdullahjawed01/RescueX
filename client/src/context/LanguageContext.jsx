import { createContext, useContext, useState } from "react";

const translations = {
    en: {
        sos: "SOS",
        medicalId: "Medical ID",
        activeUnits: "Active Units",
        firstAid: "First Aid Guide",
        nearbyHospitals: "Nearby Hospitals",
        book: "Book",
    },
    es: {
        sos: "S.O.S",
        medicalId: "ID Médico",
        activeUnits: "Unidades Activas",
        firstAid: "Guía de Primeros Auxilios",
        nearbyHospitals: "Hospitales Cercanos",
        book: "Reservar",
    },
    hi: {
        sos: "आपातकालीन",
        medicalId: "मेडिकल आईडी",
        activeUnits: "सक्रिय इकाइयां",
        firstAid: "प्राथमिक चिकित्सा",
        nearbyHospitals: "पास के अस्पताल",
        book: "बुक करें",
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

    const t = (key) => translations[lang][key] || key;

    const changeLanguage = (newLang) => {
        setLang(newLang);
        localStorage.setItem("lang", newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, t, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
