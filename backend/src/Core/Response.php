<?php

declare(strict_types=1);

namespace App\Core;

final class Response
{
    private int $statusCode = 200;
    private array $headers = ['Content-Type' => 'application/json'];

    public function withStatus(int $statusCode): self
    {
        $this->statusCode = $statusCode;
        return $this;
    }

    public function withHeader(string $name, string $value): self
    {
        $this->headers[$name] = $value;
        return $this;
    }

    public function json(array $payload): void
    {
        http_response_code($this->statusCode);
        foreach ($this->headers as $name => $value) {
            header($name . ': ' . $value);
        }

        echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    }

    public function success(mixed $data = null, string $message = ''): void
    {
        $payload = ['success' => true, 'data' => $data];
        if ($message !== '') {
            $payload['message'] = $message;
        }

        $this->json($payload);
    }

    public function error(string $message, int $statusCode = 400, array $extra = []): void
    {
        $this->withStatus($statusCode)->json(array_merge([
            'success' => false,
            'error' => $message,
            'message' => $message,
        ], $extra));
    }
}
