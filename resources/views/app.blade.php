<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="{{ $siteSettings['faviconUrl'] ?? '/favicon.ico' }}" sizes="any">
        <link rel="apple-touch-icon" href="{{ $siteSettings['logoUrl'] ?? '/apple-touch-icon.png' }}">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer">
        <script>
            window.__siteSettings = @json($siteSettings);
        </script>

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $siteSettings['seoTitle'] ?? config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        @php
            $whatsappNumber = preg_replace('/\D+/', '', $siteSettings['whatsapp'] ?? '+90 532 000 00 00');
        @endphp

        <x-inertia::app />

        @if ($whatsappNumber)
            <a
                href="https://wa.me/{{ $whatsappNumber }}"
                target="_blank"
                rel="noopener noreferrer"
                class="whatsapp-float"
                aria-label="WhatsApp ile iletisime gec"
            >
                <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            </a>
        @endif
    </body>
</html>
