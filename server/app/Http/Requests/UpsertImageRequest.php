<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpsertImageRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            // Max 10MB, must be an image
            'image' => ['required', 'image', 'mimes:jpeg,png,webp,jpg', 'max:20480'],
            'filename' => ['sometimes', 'string', 'max:255'],
        ];
    }
}