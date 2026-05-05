<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\BuildsAdminProps;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateMessageRequest;
use App\Models\ContactRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessagesController extends Controller
{
    use BuildsAdminProps;

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'MESSAGES_VIEW');

        $messages = ContactRequest::query()
            ->select(['id', 'property_id', 'name', 'phone', 'email', 'message', 'status', 'created_at'])
            ->with('property:id,title')
            ->latest('created_at')
            ->get()
            ->map(fn (ContactRequest $message): array => [
                'id' => $message->id,
                'name' => $message->name,
                'phone' => $message->phone,
                'email' => $message->email,
                'message' => $message->message,
                'status' => $message->status,
                'createdAt' => $message->created_at?->toISOString(),
                'propertyTitle' => $message->property?->title,
            ]);

        return Inertia::render('admin/messages', [
            'adminUser' => $this->adminUser($user),
            'messages' => $messages,
            'canEdit' => $this->userCan($user, 'MESSAGES_EDIT'),
        ]);
    }

    public function update(UpdateMessageRequest $request, ContactRequest $message): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'MESSAGES_EDIT');

        $message->update($request->validated());

        return redirect()
            ->route('admin.messages.index')
            ->with('status', 'message-updated');
    }

    public function destroy(Request $request, ContactRequest $message): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'MESSAGES_EDIT');

        $message->delete();

        return redirect()
            ->route('admin.messages.index')
            ->with('status', 'message-deleted');
    }
}
