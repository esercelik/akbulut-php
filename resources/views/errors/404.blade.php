<!DOCTYPE html>
<html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Sayfa Bulunamadi | Akbulut Emlak</title>
        <style>
            :root {
                color-scheme: light;
            }

            * {
                box-sizing: border-box;
            }

            body {
                margin: 0;
                min-height: 100vh;
                display: grid;
                place-items: center;
                padding: 24px;
                background: #f7f8fa;
                color: #0b1f3a;
                font-family: Inter, Arial, sans-serif;
            }

            .panel {
                width: min(100%, 720px);
                background: #ffffff;
                border: 1px solid #e2e5ea;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(11, 31, 58, 0.08);
            }

            .eyebrow {
                margin: 0;
                color: #b9943a;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.16em;
                text-transform: uppercase;
            }

            h1 {
                margin: 16px 0 0;
                font-size: clamp(32px, 5vw, 48px);
                line-height: 1.1;
            }

            p {
                margin: 16px 0 0;
                font-size: 16px;
                line-height: 1.8;
                color: #516071;
            }

            a {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-top: 28px;
                min-height: 48px;
                padding: 0 20px;
                background: #0b1f3a;
                color: #ffffff;
                text-decoration: none;
                font-weight: 700;
            }
        </style>
    </head>
    <body>
        <main class="panel">
            <p class="eyebrow">404</p>
            <h1>Aradiginiz sayfa bulunamadi.</h1>
            <p>
                Sayfa kaldirilmis, adres degismis veya baglanti eksik olabilir.
                Ana sayfaya donerek guncel portfoylere ulasabilirsiniz.
            </p>
            <a href="{{ url('/') }}">Ana Sayfaya Don</a>
        </main>
    </body>
</html>
