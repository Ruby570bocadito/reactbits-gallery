"""Verify the live-site screenshot shows real rendered content (non-black pixels)."""
from PIL import Image

img = Image.open("/home/z/my-project/download/pages-live-check.png").convert("RGB")
w, h = img.size
print(f"screenshot: {w}x{h}")

# Hero region: top 800px (Aurora background + title)
hero = img.crop((0, 0, w, 800))
hero_px = list(hero.getdata())
lit_hero = sum(1 for r, g, b in hero_px if r + g + b > 60)
print(f"hero region: {lit_hero}/{len(hero_px)} lit pixels ({100*lit_hero/len(hero_px):.1f}%)")

# Full page
all_px = list(img.getdata())
lit_all = sum(1 for r, g, b in all_px if r + g + b > 60)
print(f"full page:  {lit_all}/{len(all_px)} lit pixels ({100*lit_all/len(all_px):.1f}%)")

# Sample some colors from the hero to show it's not flat black
colors = hero.getcolors(maxcolors=100000)
colors.sort(reverse=True)
print("top hero colors (count, RGB):")
for cnt, c in colors[:5]:
    print(f"  {cnt:>8}  {c}")

verdict = "RENDERED OK" if lit_hero > len(hero_px) * 0.02 else "SUSPICIOUS: hero nearly black"
print("verdict:", verdict)
