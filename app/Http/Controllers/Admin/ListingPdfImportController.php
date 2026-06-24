<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\BuildsAdminProps;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportListingPdfRequest;
use App\Models\User;
use App\Services\OpenAiListingExtractorService;
use App\Services\PdfListingTextExtractor;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class ListingPdfImportController extends Controller
{
    use BuildsAdminProps;

    public function __invoke(
        ImportListingPdfRequest $request,
        PdfListingTextExtractor $pdfTextExtractor,
        OpenAiListingExtractorService $openAiListingExtractor,
    ): JsonResponse {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'LISTINGS_CREATE');

        try {
            $pdfText = $pdfTextExtractor->extract($request->file('pdf'));
            $data = $openAiListingExtractor->extract($pdfText);

            return response()->json([
                'data' => $data,
                'message' => 'PDF’den ilan bilgileri aktarıldı. Lütfen kontrol edip kaydedin.',
            ]);
        } catch (RuntimeException $exception) {
            $this->reportImportFailure($exception);

            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        } catch (Throwable $exception) {
            $this->reportImportFailure($exception);

            return response()->json([
                'message' => 'PDF analizi sirasinda beklenmeyen bir hata olustu.',
            ], 500);
        }
    }

    private function reportImportFailure(Throwable $exception): void
    {
        Log::warning('listing_pdf_import_failed', [
            'type' => $exception::class,
            'message' => Str::limit($exception->getMessage(), 160),
        ]);
    }
}
