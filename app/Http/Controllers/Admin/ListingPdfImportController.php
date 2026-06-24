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
            $data['matched_consultant_id'] = $this->matchedConsultantId($data['contact_name'] ?? '', $user);

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

    private function matchedConsultantId(mixed $contactName, User $user): ?int
    {
        if (! is_string($contactName) || trim($contactName) === '') {
            return null;
        }

        $normalizedContactName = $this->normalizeName($contactName);

        return User::query()
            ->select(['id', 'name', 'surname'])
            ->where('role', 'CONSULTANT')
            ->where('active', true)
            ->when($user->role === 'CONSULTANT', fn ($query) => $query->whereKey($user->id))
            ->get()
            ->first(function (User $consultant) use ($normalizedContactName): bool {
                $fullName = trim($consultant->name.' '.($consultant->surname ?? ''));
                $normalizedFullName = $this->normalizeName($fullName);

                return $normalizedFullName === $normalizedContactName
                    || str_contains($normalizedContactName, $normalizedFullName)
                    || str_contains($normalizedFullName, $normalizedContactName);
            })?->id;
    }

    private function normalizeName(string $value): string
    {
        $value = preg_replace('/\s+/u', ' ', trim(strip_tags($value))) ?? $value;

        return mb_strtolower(Str::ascii($value, 'tr'), 'UTF-8');
    }

    private function reportImportFailure(Throwable $exception): void
    {
        Log::warning('listing_pdf_import_failed', [
            'type' => $exception::class,
            'message' => Str::limit($exception->getMessage(), 160),
        ]);
    }
}
