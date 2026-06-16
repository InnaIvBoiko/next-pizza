# Prompt immagini — Home (Nano Banana / Gemini Image)

Stile coerente con il redesign: **Palette B "Pomodoro & Basilico"**, look Apple, food
photography premium, funziona su light e dark.

**Come usarli**

1. Incolla il prompt in Nano Banana (uno alla volta).
2. Salva il file con il nome indicato dentro `public/images/` (crea la cartella).
3. Dimmi "fatto" e io sostituisco i placeholder a gradiente con le immagini reali
   (`next/image`) nei componenti.

> Nano Banana non garantisce i pixel esatti: genera, poi ridimensiona/croppa al
> formato indicato. Per le illustrazioni a linee chiedi **sfondo trasparente (PNG)**.

**Stile comune (già incluso in ogni prompt):** premium food photography, warm
cinematic lighting, shallow depth of field, authentic Italian trattoria mood,
tomato-red (#E23744) and basil-green (#4A7C59) accents, photorealistic, 8k,
**no text, no watermark, no logos**.

---

## 1. Hero — `public/images/hero-pizza.png` · 2000×1500 (4:3)

```
A freshly baked Neapolitan margherita pizza shot from a 45-degree top-down angle
on a rustic dark wooden table. Leopard-spotted charred crust, melted buffalo
mozzarella, vibrant San Marzano tomato sauce, fresh basil leaves, light steam
rising. Warm golden side light, deep dark warm background that fades out toward
the left, with generous empty negative space on the left third for headline text.
Shallow depth of field, premium Apple-style food photography, photorealistic, 8k.
No text, no watermark, no logos. Aspect ratio 4:3.
```

Nota: lo **spazio vuoto a sinistra** serve perché lì sopra ci va il titolo.

---

## 2. Chi siamo — `public/images/about-forno.png` · 1600×1200 (4:3)

```
An Italian pizzaiolo sliding a pizza into a glowing wood-fired brick oven using a
long wooden peel. Orange flames and embers, warm amber glow lighting his hands and
face, dark atmospheric artisan pizzeria interior, cinematic chiaroscuro lighting,
sense of motion in the flames, authentic and warm mood. Photorealistic, 8k.
No text, no watermark, no logos. Aspect ratio 4:3.
```

---

## 3. Testimonianze — 3 avatar · 400×400 (1:1)

Genera i tre con **stessa luce e stesso sfondo** per coerenza. Sfondo beige neutro
caldo, ritratto centrato, sorriso genuino, sguardo in camera.

**`public/images/avatar-1.png`** (Giulia R.)

```
Studio headshot portrait of a young Italian woman in her late 20s with wavy brown
hair, casual style, genuine friendly smile, looking at the camera. Soft natural
window light, warm neutral beige background, shallow depth of field, centered
composition. Photorealistic, 8k. No text, no watermark. Aspect ratio 1:1.
```

**`public/images/avatar-2.png`** (Marco T.)

```
Studio headshot portrait of a friendly Italian man in his 30s with short dark hair
and light stubble, casual shirt, warm genuine smile, looking at the camera. Soft
natural window light, warm neutral beige background, shallow depth of field,
centered composition. Photorealistic, 8k. No text, no watermark. Aspect ratio 1:1.
```

**`public/images/avatar-3.png`** (Sara B.)

```
Studio headshot portrait of a cheerful Italian woman in her early 40s with
shoulder-length blonde hair, casual elegant style, warm genuine smile, looking at
the camera. Soft natural window light, warm neutral beige background, shallow depth
of field, centered composition. Photorealistic, 8k. No text, no watermark.
Aspect ratio 1:1.
```

---

## 4. (Opzionale) Illustrazioni "Come funziona" · 600×600 (1:1, PNG trasparente)

Oggi la sezione usa icone. Se vuoi illustrazioni al loro posto, genera queste tre
con **stile identico**: flat line illustration, accento rosso pomodoro #E23744,
spessore linea costante, sfondo trasparente.

**`public/images/step-order.png`**

```
Minimal flat line illustration of a shopping bag with a pizza slice, single
tomato-red accent color #E23744, clean consistent 2px line weight, modern, simple,
transparent background. No text. Aspect ratio 1:1.
```

**`public/images/step-kitchen.png`**

```
Minimal flat line illustration of a chef hat over a pizza in a wood-fired oven,
single tomato-red accent color #E23744, clean consistent 2px line weight, modern,
simple, transparent background. No text. Aspect ratio 1:1.
```

**`public/images/step-delivery.png`**

```
Minimal flat line illustration of a delivery scooter carrying a pizza box, single
tomato-red accent color #E23744, clean consistent 2px line weight, modern, simple,
transparent background. No text. Aspect ratio 1:1.
```

---

## 5. (Opzionale) Social preview — `public/og-home.png` · 1200×630 (1.91:1)

```
Wide cinematic composition: a Neapolitan margherita pizza on dark warm wood placed
on the right side, deep dark warm background with a soft glow on the left half kept
empty for a title overlay. Premium food photography, warm lighting, photorealistic,
8k. No text, no watermark, no logos. Aspect ratio 1.91:1.
```

Nota: il titolo verrà aggiunto via codice, lascia la metà sinistra vuota.
