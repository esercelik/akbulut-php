<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use RuntimeException;
use Smalot\PdfParser\Parser;
use Throwable;

class PdfListingTextExtractor
{
    public function extract(UploadedFile $pdf): string
    {
        try {
            $text = (new Parser)->parseFile($pdf->getRealPath())->getText();
        } catch (Throwable $exception) {
            throw new RuntimeException('PDF dosyasi okunamadi.', previous: $exception);
        }

        $text = $this->cleanText($text);

        if (mb_strlen($text) < 20) {
            throw new RuntimeException('PDF icinden metin cikarilamadi.');
        }

        // TODO: Gorsel agirlikli PDF'ler icin sonraki surumde OCR destegi eklenebilir.
        return mb_substr($text, 0, 30000);
    }

    private function cleanText(string $text): string
    {
        $text = preg_replace('/[ \t]+/u', ' ', $text) ?? $text;
        $text = preg_replace('/\R{3,}/u', "\n\n", $text) ?? $text;

        return trim($text);
    }
}
