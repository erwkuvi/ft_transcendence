import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './languages/en.json';
import pl from './languages/pl.json';
import es from './languages/es.json';
import lt from './languages/lt.json';

i18n.use(initReactI18next).init({
	lng: "en",
	fallbackLng: "en",
	interpolation: {
	  escapeValue: false,
	},
	resources: {
		en: {
		  translation: en,
		},
		pl: {
		  translation: pl,
		},
		es: {
		  translation: es,
		},
		lt: {
		  translation: lt,
		},
	  },
	});

export default i18n;