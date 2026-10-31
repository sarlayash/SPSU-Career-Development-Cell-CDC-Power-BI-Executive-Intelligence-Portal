import os

dist_dir = "C:/Users/LC/.gemini/antigravity/scratch/spsu-cdc-analytics/dist"
assets_dir = os.path.join(dist_dir, "assets")

css_file = [f for f in os.listdir(assets_dir) if f.endswith(".css")][0]
js_file = [f for f in os.listdir(assets_dir) if f.endswith(".js")][0]

with open(os.path.join(assets_dir, css_file), "r", encoding="utf-8") as f:
    css_content = f.read()

with open(os.path.join(assets_dir, js_file), "r", encoding="utf-8") as f:
    js_content = f.read()

html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F2C811'><rect width='4' height='12' x='3' y='9' rx='1'/><rect width='4' height='17' x='10' y='4' rx='1'/><rect width='4' height='7' x='17' y='14' rx='1'/></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SPSU Career Development Cell - Power BI Executive Analytics (Directorate Portal)</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
{css_content}
    </style>
  </head>
  <body class="bg-[#F3F4F6] dark:bg-[#18181B] text-slate-900 dark:text-slate-100 font-powerbi antialiased overflow-hidden select-none">
    <div id="root"></div>
    <script>
{js_content}
    </script>
  </body>
</html>
"""

output_path = "C:/Users/LC/.gemini/antigravity/scratch/spsu-cdc-analytics/standalone_dashboard.html"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Created standalone file: {output_path} ({len(html) / 1024:.1f} KB)")
