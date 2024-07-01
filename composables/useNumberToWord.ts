type Lang = "fr" | "en" | "ar" | "de";

export function useNumberToWords() {
  const languages: Record<Lang, any> = {
    en: {
      units: [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
      ],
      teens: [
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ],
      tens: [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ],
      scales: ["", "thousand", "million", "billion", "trillion"],
    },
    fr: {
      units: [
        "",
        "un",
        "deux",
        "trois",
        "quatre",
        "cinq",
        "six",
        "sept",
        "huit",
        "neuf",
      ],
      teens: [
        "dix",
        "onze",
        "douze",
        "treize",
        "quatorze",
        "quinze",
        "seize",
        "dix-sept",
        "dix-huit",
        "dix-neuf",
      ],
      tens: [
        "",
        "",
        "vingt",
        "trente",
        "quarante",
        "cinquante",
        "soixante",
        "soixante",
        "quatre-vingt",
        "quatre-vingt",
      ],
      scales: ["", "mille", "million", "milliard", "billion"],
    },
    ar: {
      units: [
        "",
        "واحد",
        "اثنان",
        "ثلاثة",
        "أربعة",
        "خمسة",
        "ستة",
        "سبعة",
        "ثمانية",
        "تسعة",
      ],
      teens: [
        "عشرة",
        "أحد عشر",
        "اثنا عشر",
        "ثلاثة عشر",
        "أربعة عشر",
        "خمسة عشر",
        "ستة عشر",
        "سبعة عشر",
        "ثمانية عشر",
        "تسعة عشر",
      ],
      tens: [
        "",
        "",
        "عشرون",
        "ثلاثون",
        "أربعون",
        "خمسون",
        "ستون",
        "سبعون",
        "ثمانون",
        "تسعون",
      ],
      scales: ["", "ألف", "مليون", "مليار", "تريليون"],
    },
    de: {
      units: [
        "",
        "ein",
        "zwei",
        "drei",
        "vier",
        "fünf",
        "sechs",
        "sieben",
        "acht",
        "neun",
      ],
      teens: [
        "zehn",
        "elf",
        "zwölf",
        "dreizehn",
        "vierzehn",
        "fünfzehn",
        "sechzehn",
        "siebzehn",
        "achtzehn",
        "neunzehn",
      ],
      tens: [
        "",
        "",
        "zwanzig",
        "dreißig",
        "vierzig",
        "fünfzig",
        "sechzig",
        "siebzig",
        "achtzig",
        "neunzig",
      ],
      scales: ["", "tausend", "Million", "Milliarde", "Billion"],
    },
  };

  function convertThreeDigits(n: number, lang: Lang): string {
    if (n === 0) return "";

    let words: string[] = [];
    let hundreds = Math.floor(n / 100);
    let remainder = n % 100;

    if (hundreds > 0) {
      if (lang === "de") {
        words.push(languages[lang].units[hundreds] + "hundert");
      } else if (lang === "fr") {
        words.push(
          hundreds === 1 ? "cent" : languages[lang].units[hundreds] + " cent"
        );
      } else if (lang === "ar") {
        words.push(
          hundreds === 1 ? "مائة" : languages[lang].units[hundreds] + " مائة"
        );
      } else {
        words.push(languages[lang].units[hundreds] + " hundred");
      }
    }

    if (remainder > 0) {
      if (lang === "en" && hundreds > 0) {
        words.push("and");
      }

      if (remainder < 20) {
        words.push(
          languages[lang].units[remainder] ||
            languages[lang].teens[remainder - 10]
        );
      } else {
        let tens = Math.floor(remainder / 10);
        let ones = remainder % 10;

        if (lang === "fr" && (tens === 7 || tens === 9)) {
          words.push(languages[lang].tens[tens - 1]);
          words.push(languages[lang].teens[ones]);
        } else {
          words.push(languages[lang].tens[tens]);
          if (ones > 0) {
            if (lang === "de") {
              words[words.length - 1] =
                languages[lang].units[ones] + "und" + words[words.length - 1];
            } else if (lang === "fr" && tens === 8) {
              words.push(languages[lang].units[ones]);
            } else if (lang === "en") {
              words[words.length - 1] += "-" + languages[lang].units[ones];
            } else {
              words.push(languages[lang].units[ones]);
            }
          }
        }
      }
    }

    return words.join(lang === "de" ? "" : " ").trim();
  }

  function numberToWords(num: number, lang: Lang = "en"): string {
    if (num === 0) {
      return lang === "en"
        ? "zero"
        : lang === "fr"
        ? "zéro"
        : lang === "ar"
        ? "صفر"
        : "null";
    }

    let words: string[] = [];
    let scale = 0;

    while (num > 0) {
      let threeDigits = num % 1000;
      if (threeDigits > 0) {
        let chunk = convertThreeDigits(threeDigits, lang);
        if (scale > 0 && chunk !== "") {
          if (lang === "fr" && scale === 1 && threeDigits === 1) {
            chunk = languages[lang].scales[scale];
          } else {
            chunk += " " + languages[lang].scales[scale];
          }
        }
        words.unshift(chunk);
      }
      num = Math.floor(num / 1000);
      scale++;
    }

    return words.join(" ").trim();
  }

  return {
    numberToWords,
  };
}
