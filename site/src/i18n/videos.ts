import type { VideoId } from "~/data/site";
import type { Lang } from "./ui";

export const videoCopy: Record<Lang, Record<VideoId, { title: string; summary: string }>> = {
  en: {
    setup: {
      title: "Install with uv and the one-time Google Cloud setup",
      summary:
        "uv tool install lexo, a Google Cloud project, the Drive API, the OAuth consent screen, credentials.json in the config folder, then lexo login.",
    },
    scanned: {
      title: "OCR a scanned Burmese PDF in the desktop app",
      summary:
        "Open the file, split two-up spreads and crop margins in the visual editor, run Google Docs OCR, review each page, export plain text.",
    },
    legacy: {
      title: "Legacy-font PDFs: getting real Burmese text",
      summary:
        "Win Innwa and similar fonts store Burmese as ASCII letters. Spot the case in the text pane, switch to Google Docs OCR, and get Myanmar Unicode back.",
    },
  },
  my: {
    setup: {
      title: "uv ဖြင့် ထည့်သွင်းခြင်းနှင့် Google Cloud ပြင်ဆင်နည်း",
      summary:
        "uv tool install lexo ဖြင့် ထည့်သွင်းပါ။ Google Cloud project ဖန်တီး၊ Drive API ဖွင့်၊ OAuth ခွင့်ပြုချက်ပြင်ဆင်ပြီး credentials.json ကို Config folder ထဲ ထည့်ပါ။ နောက်ဆုံး lexo login ဖြင့် အကောင့်ဝင်ပါ။",
    },
    scanned: {
      title: "မြန်မာစကင် PDF ကို အက်ပ်ဖြင့် OCR လုပ်နည်း",
      summary:
        "ဖိုင်ဖွင့်ပြီး ပုံမှာမြင်ရတဲ့အတိုင်း စာမျက်နှာနှစ်ခုတွဲတွေကို ခွဲပါ။ ဘေးလွတ်နေရာတွေ ဖြတ်တောက်ပြီး Google Docs OCR သုံးပါ။ စာမျက်နှာအလိုက် စစ်ဆေးကာ Plain text ဖိုင်အဖြစ် သိမ်းပါ။",
    },
    legacy: {
      title: "ဖောင့်ဟောင်း PDF မှ Unicode ရယူနည်း",
      summary:
        "Win Innwa လို ဖောင့်တွေက မြန်မာစာကို ASCII စာလုံးတွေအဖြစ် သိမ်းထားပါတယ်။ Text pane မှာ အဲဒီလို ဖိုင်မျိုးကို ခွဲခြားသိနိုင်ပုံနဲ့ Google Docs OCR ပြောင်းသုံးပြီး မြန်မာ Unicode ရယူပုံကို ပြထားပါတယ်။",
    },
  },
};
