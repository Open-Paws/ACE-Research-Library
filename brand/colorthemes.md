# 🎨 **ACE COLOR SYSTEM — FULL EXPANDED SPEC**

## ---------------------------------------------------

# 1. PRIMARY COLOR PALETTE (CORE BRAND COLORS)

These 3 colors must dominate the brand. They represent trust, professionalism, and ACE’s historical identity.

---

## **1.1 Primary Teal**

**HEX:** `#00A6A1`
**RGB:** `0,166,161`
**CMYK:** `79,11,42,0`

### Meaning & Purpose

* ACE’s legacy color, modernized
* Represents *boldness, clarity, impact, compassion*
* Most emotionally engaging color
* Must appear prominently in major brand elements

### Recommended Uses

* Buttons (primary)
* Highlights & callouts
* Major sections of the website
* Key interactive components
* Important data visualization elements

### Avoid

* Using Teal excessively with secondary colors
* Using Teal for body text (too low readability)

---

## **1.2 Navy (Brand Neutral Dark)**

**HEX:** `#041C30`
**RGB:** `4,28,48`
**CMYK:** `93,78,52,65`

### Meaning & Purpose

* Introduces stability, professionalism, seriousness
* High contrast backbone for layout
* Allows Teal to pop

### Recommended Uses

* Headers
* Footer backgrounds
* High-contrast card backgrounds
* Body text on light surfaces (or 80–60% navy tints)

### Avoid

* Using navy at >80% for large backgrounds without enough Teal to balance

---

## **1.3 White**

**HEX:** `#FFFFFF`
**RGB:** `255,255,255`
**CMYK:** `0,0,0,0`

### Meaning

* Clean, breathable, optimistic
* Helps maintain anti-speciesist and compassionate tone

### Usage

* Page backgrounds
* Card backgrounds
* Negative space around logo

---

## ---------------------------------------------------

# 2. NAVY-BASED NEUTRAL SYSTEM

*(Derived from Navy to maintain brand cohesion)*

ACE does **not** use generic grays — every neutral is a tint of Navy.
The usable tints are **very light or very dark**, never mid-tones.

### Allowed Neutral Tints (from guide):

| Tint % | HEX       | RGB         |
| ------ | --------- | ----------- |
| 80%    | `#36485A` | 54,72,90    |
| 60%    | `#687683` | 104,118,131 |
| 10%    | `#E6E8EA` | 230,232,234 |
| 5%     | `#F3F4F5` | 243,244,245 |
| 2%     | `#FAFAFB` | 250,250,251 |

### Usage Notes

* **80–60%** → For text & icons
* **10–2%** → For subtle backgrounds
* Avoid **50–20% tints** (brand guide warns these appear dull).

---

# ---------------------------------------------------

# 3. SECONDARY COLOR PALETTE

Used for accents, freshness, warm tone, and differentiation.

These colors must **never overpower** the Primary palette.

---

## **3.1 Apple (Movement Grants Color)**

**HEX:** `#A5AF1B`
**RGB:** `165,175,27`
**CMYK:** `40,18,100,1`

### Meaning

* Friendly, approachable
* Symbolizes growth and empowerment

### Usage

* Movement Grants program materials
* Accent elements
* Iconography

---

## **3.2 Ocean (Recommended Charity Fund Color)**

**HEX:** `#0C6DAB`
**RGB:** `12,109,171`
**CMYK:** `90,55,8,0`

### Meaning

* Stability
* Calm intelligence

### Usage

* Charity Fund materials
* UI detail elements

---

## **3.3 Berry (Charity Evaluations Color)**

**HEX:** `#843468`
**RGB:** `132,52,104`
**CMYK:** `49,92,32,13`

### Meaning

* Depth
* Seriousness
* Analytical voice

### Usage

* Evaluation program
* Graphs & charts
* Icon color variations

---

# ---------------------------------------------------

# 4. COLOR PROPORTIONS (CRITICAL FOR DESIGN)

ACE has strong rules about **proportion**, not just individual colors.

### Overall Ratio (Recommended)

| Color Group               | % of Total Visual Surface |
| ------------------------- | ------------------------- |
| **Primary Colors**        | **70%–85%**               |
| **Secondary Colors**      | **5%–20%**                |
| **Neutrals (Navy tints)** | **10%–20%**               |

### Practical Rule

If a design looks:

* **Too playful** → Remove secondary colors; add navy/white
* **Too dull** → Increase Teal or small accents of secondary
* **Too heavy** → Add more white/light tints

---

# ---------------------------------------------------

# 5. BUTTON, UI COMPONENT, AND ACCESSIBILITY RULES

## **5.1 Primary Button**

* Background: **Teal (#00A6A1)**
* Text: **White**
* Hover: Slightly darker teal (auto-generated via 10–15% darkening)

## **5.2 Secondary Button**

* Navy background
* White text
* Hover: Teal border or subtle glow

## **5.3 Tertiary Button**

* Transparent
* Text: Teal
* Underline on hover

---

### **Accessibility (WCAG Compliant Color Pairings)**

ACE must appear professional & trustworthy → contrast is essential.

#### Approved High-Contrast Pairs:

* Navy (#041C30) on White (#FFFFFF)
* Teal (#00A6A1) on Navy (#041C30)
* White (#FFFFFF) on Navy (#041C30)
* Navy tints (80–60%) on White

#### Pairs to Avoid:

* Teal on White → borderline contrast for small text
* Apple on White → too light
* Berry on Navy → too low contrast for readability

---

# ---------------------------------------------------

# 6. GRADIENT SYSTEM (Required in ACE Visual Language)

ACE uses **soft, smooth gradients** in backgrounds, illustrations, and edited photography.

## **6.1 Brand Gradient Backgrounds**

### **Teal Gradient**

* From `#00A6A1` → lighter teal or white

### **Navy Gradient**

* Deep navy (`#041C30`) → medium navy (`#36485A`)

### **White Gradient (Important Rule)**

* Base: **2% navy tint (#FAFAFB)**
* Used to avoid blending with platform white backgrounds (e.g., social feeds)

---

## **6.2 Photo Glow Gradients**

Used in corners of photo edits.

Allowed glow colors:

* Teal
* Apple
* Ocean

Rules:

* Use 1–3 glows per image
* Vary colors per asset
* Lower opacity if photo itself is colorful

---

# ---------------------------------------------------

# 7. COLOR TOKENS FOR DEVELOPMENT

### (CSS Variables — Copy/Paste Ready)

```css
:root {
  /* Primary */
  --ace-teal: #00A6A1;
  --ace-navy: #041C30;
  --ace-white: #FFFFFF;

  /* Navy Tints */
  --ace-navy-80: #36485A;
  --ace-navy-60: #687683;
  --ace-navy-10: #E6E8EA;
  --ace-navy-5:  #F3F4F5;
  --ace-navy-2:  #FAFAFB;

  /* Secondary */
  --ace-apple: #A5AF1B;
  --ace-ocean: #0C6DAB;
  --ace-berry: #843468;
}
```

---

# ---------------------------------------------------

# 8. COLOR TOKENS (TAILWIND CONFIG)

```js
extend: {
  colors: {
    ace: {
      teal: "#00A6A1",
      navy: "#041C30",
      white: "#FFFFFF",
      apple: "#A5AF1B",
      ocean: "#0C6DAB",
      berry: "#843468",
      neutral: {
        80: "#36485A",
        60: "#687683",
        10: "#E6E8EA",
        5: "#F3F4F5",
        2: "#FAFAFB"
      }
    }
  }
}
```

---

# ---------------------------------------------------

# 9. COMPLETE COLOR USAGE MAP (BRAND GUIDE → AI TRANSLATION)

### **Core Brand Expressions**

* Teal = identity, calls to action
* Navy = professionalism, scientific tone
* White = openness, empathy

### **Secondary Accent Rules**

* Apple = Movement Grants
* Ocean = Recommended Charity Fund
* Berry = Charity Evaluations
* Use sparingly to avoid loss of seriousness

### **Graph + Data Visualization**

* Use full color palette but structured:

    * Teal = baseline data
    * Navy = axes/labels
    * Secondary colors = category differentiation

### **Social Media**

* Maintain feed-level balance
* No more than 1 extremely bright color per post
* Alternate light/dark backgrounds
