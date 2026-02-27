<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Mews\Purifier\Facades\Purifier;

class UpsertPostRequest extends FormRequest {

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array 
    {
        $isPost = $this->isMethod('post');

        return [
            'title'           => [$isPost ? 'required' : 'sometimes', 'string', 'max:255'],
            'body'            => [$isPost ? 'required' : 'sometimes', 'string'],
            'published'       => ['sometimes', 'boolean'],
            'banner'          => [$isPost ? 'required' : 'sometimes', 'string'], 
            // Validation for the gallery images
            'slider_images' => ['sometimes', 'array'],
            'slider_images.*.id' => ['required', 'exists:images,id'],
            'slider_images.*.sort_order' => ['required', 'integer'],
        ];
    }

    /**
     * Sanitize HTML in the body field after validation passes.
     */
    protected function passedValidation(): void
    {
        if ($this->has('body')) {
            $this->merge([
                'body' => Purifier::clean($this->input('body')),
            ]);
        }
    }
}
