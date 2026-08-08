# MEEFF AdBlock - Shadowrocket Ad Removal Modules

Shadowrocket modules to remove ads from the MEEFF app. Available in basic and advanced versions.

## What the Modules Do

Based on analysis of the MEEFF Android APK (v6.x) via Exodus Privacy static analysis, MEEFF embeds 19 third-party SDKs, with the main ad-related ones being:

- AppLovin MAX (primary ad mediation platform)
- Google AdMob / DoubleClick
- Meta Audience Network (Facebook Ads)
- ironSource, Pangle (TikTok), Tapjoy, Unity Ads
- Amazon Ads, Mintegral, Fyber, AD(X)
- Korean ad networks: AdFit (Daum/Kakao), AdPie (GOM Factory), TNK Factory

The modules REJECT requests to these SDK domains. Once ad requests are blocked, the app cannot retrieve ad content, and third-party ads such as banners, interstitials, and rewarded videos are eliminated.

## Which Version to Choose

| Version | Features | Use Case |
|---------|----------|----------|
| **Basic** | Domain-level blocking only, **no HTTPS decryption needed** | Quick setup, no extra config |
| **Pro** | Domain blocking + API interception + script filtering, **requires HTTPS decryption** | Best results |

## Files

| File | Purpose |
|------|---------|
| `MEEFF_AdBlock.sgmodule` | Basic module — domain-level ad blocking |
| `MEEFF_AdBlock_Pro.sgmodule` | Pro module — domain blocking + API interception + script filtering |
| `MEEFF_Ads_Filter.js` | Optional ad filter script (for Pro version) |

## Installation

### Basic Version

1. Open Shadowrocket → Config → Module
2. Tap the + button (top right)
3. Paste the URL:

```
https://raw.githubusercontent.com/arvinzhang95/meeff-adblock/main/MEEFF_AdBlock.sgmodule
```

Works immediately after import, no additional setup needed.

### Pro Version

1. Open Shadowrocket → Config → Module
2. Tap the + button (top right)
3. Paste the URL:

```
https://raw.githubusercontent.com/arvinzhang95/meeff-adblock/main/MEEFF_AdBlock_Pro.sgmodule
```

4. Make sure HTTPS decryption is enabled and the CA certificate is installed and trusted
5. Turn on the VPN switch, then open MEEFF

**What the Pro version blocks by default:**

- Layer 1: Blocks all third-party ad SDK domains integrated in MEEFF
- Layer 2: Blocks `api.meeff.com` endpoints with paths starting with ad/ads/banner/interstitial/splash, etc.

## Layer 3 (Optional): JSON Ad Filter Script

If there are still a few ads in the feed (served by MEEFF servers as JSON), you can enable the script layer:

1. Upload `MEEFF_Ads_Filter.js` to any accessible HTTPS address (recommended: GitHub Gist — https://gist.github.com → New gist → paste the script → Create public gist → use the raw link)
2. Edit `MEEFF_AdBlock_Pro.sgmodule`, replace `script-path=https://your-address/MEEFF_Ads_Filter.js` in the `[Script]` section with your actual raw URL, and remove the `#` at the beginning of that line
3. Reload the module and restart MEEFF

If you don't want to bother, just leave the script line commented out — the first two layers will still work fine.

## FAQ

### MEEFF can't log in or load content

The app may have implemented certificate pinning (HTTPS decryption detected). In this case, switch from the Pro version back to the Basic version (domain blocking only), or temporarily turn off HTTPS decryption.

### Still seeing ads?

1. Check Shadowrocket → Config → Logs to identify the actual ad request domains
2. Let me know the domain and I can add it to the module rules
3. Or add a line yourself in the module's `[Rule]` section: `DOMAIN-SUFFIX,domain,REJECT`

## Notes

- The modules work globally, blocking all apps from accessing these ad domains
- Does not block Facebook login/sharing, Firebase analytics, or other non-ad functions
- The two AD(X) rules (`adx.com`, etc.) can be safely removed from the module without affecting other blocking

## Compatible Apps

Besides Shadowrocket, these tools can also be used:

- **Loon / Stash** — Support similar module syntax, can import .sgmodule directly
- **Surge** — Partially compatible, may need manual syntax adjustments
- **Quantumult X** — Supports rewrite rules, needs manual conversion

## Disclaimer

These modules are for educational and research purposes only. Users are responsible for complying with applicable laws and regulations. The author assumes no liability for any consequences arising from the use of these modules.

---

[中文说明](README_zh.md)
